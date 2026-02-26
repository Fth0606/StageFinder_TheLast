<?php

namespace App\Http\Controllers\Api;

use App\Models\Application;
use App\Models\Student;
use App\Models\Company;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    /**
     * Get all applications for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->first();
            
            if (!$student) {
                return response()->json(['message' => 'Student profile not found'], 404);
            }
            
            $applications = Application::with(['offer.company.user'])
                ->where('student_id', $student->id)
                ->latest()
                ->get();
                
            return response()->json($applications);
            
        } elseif ($user->role === 'company') {
            $company = Company::where('user_id', $user->id)->first();
            
            if (!$company) {
                return response()->json(['message' => 'Company profile not found'], 404);
            }
            
            $applications = Application::with(['student.user', 'offer'])
                ->whereHas('offer', function($q) use ($company) {
                    $q->where('company_id', $company->id);
                })
                ->latest()
                ->get();
                
            return response()->json($applications);
            
        } elseif ($user->role === 'admin') {
            $applications = Application::with(['student.user', 'offer.company.user'])
                ->latest()
                ->paginate(20);
                
            return response()->json($applications);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    /**
     * Create a new application (for students)
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Only students can apply'], 403);
        }

        $validator = Validator::make($request->all(), [
            'offer_id' => 'required|exists:offers,id',
            'cover_letter' => 'nullable|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        // Check if already applied
        $existing = Application::where('student_id', $student->id)
            ->where('offer_id', $request->offer_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already applied to this offer'], 400);
        }

        // Check if offer exists and is approved
        $offer = Offer::find($request->offer_id);
        if (!$offer || $offer->status !== 'approved') {
            return response()->json(['message' => 'This offer is not available'], 400);
        }

        $application = Application::create([
            'student_id' => $student->id,
            'offer_id' => $request->offer_id,
            'cover_letter' => $request->cover_letter,
            'cv_file' => $student->cv_path, // Automatically attach student's CV
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Application submitted successfully',
            'application' => $application->load(['offer.company.user'])
        ], 201);
    }

    /**
     * Get a specific application
     */
    public function show(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        
        $application = Application::with(['student.user', 'offer.company.user'])->find($id);

        if (!$application) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        // Check authorization
        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->first();
            if ($application->student_id !== $student->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } elseif ($user->role === 'company') {
            $company = Company::where('user_id', $user->id)->first();
            if ($application->offer->company_id !== $company->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } elseif ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($application);
    }

    /**
     * Update application status (for companies)
     */
    public function update(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'company' && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:accepted,rejected',
            'reason' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $application = Application::with('offer')->find($id);

        if (!$application) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        // If company, check if they own the offer
        if ($user->role === 'company') {
            $company = Company::where('user_id', $user->id)->first();
            if ($application->offer->company_id !== $company->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $application->update([
            'status' => $request->status,
            'rejection_reason' => $request->reason ?? null,
        ]);

        // Optionally create a message/conversation when accepted
        if ($request->status === 'accepted') {
            // You could automatically create a conversation here
            // This would allow the company and student to message each other
        }

        return response()->json([
            'message' => 'Application status updated successfully',
            'application' => $application->fresh(['student.user', 'offer.company.user'])
        ]);
    }

    /**
     * Withdraw an application (for students)
     */
    public function withdraw(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $student = Student::where('user_id', $user->id)->first();
        $application = Application::where('id', $id)
            ->where('student_id', $student->id)
            ->first();

        if (!$application) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        if ($application->status !== 'pending') {
            return response()->json(['message' => 'Cannot withdraw application that is already processed'], 400);
        }

        $application->update(['status' => 'withdrawn']);

        return response()->json(['message' => 'Application withdrawn successfully']);
    }

    /**
     * Delete an application (admin only)
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $application = Application::find($id);

        if (!$application) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        $application->delete();

        return response()->json(['message' => 'Application deleted successfully']);
    }

    /**
     * Get statistics about applications (for companies)
     */
    public function statistics(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'company' && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Application::query();

        if ($user->role === 'company') {
            $company = Company::where('user_id', $user->id)->first();
            $query->whereHas('offer', function($q) use ($company) {
                $q->where('company_id', $company->id);
            });
        }

        $stats = [
            'total' => $query->count(),
            'pending' => (clone $query)->where('status', 'pending')->count(),
            'accepted' => (clone $query)->where('status', 'accepted')->count(),
            'rejected' => (clone $query)->where('status', 'rejected')->count(),
            'withdrawn' => (clone $query)->where('status', 'withdrawn')->count(),
            'today' => (clone $query)->whereDate('created_at', today())->count(),
            'thisWeek' => (clone $query)->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'thisMonth' => (clone $query)->whereMonth('created_at', date('m'))->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Bulk update application status (for companies)
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'company' && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'application_ids' => 'required|array|min:1',
            'application_ids.*' => 'exists:applications,id',
            'status' => 'required|in:accepted,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = Application::whereIn('id', $request->application_ids);

        // If company, verify they own all these applications
        if ($user->role === 'company') {
            $company = Company::where('user_id', $user->id)->first();
            $query->whereHas('offer', function($q) use ($company) {
                $q->where('company_id', $company->id);
            });
        }

        $count = $query->update(['status' => $request->status]);

        return response()->json([
            'message' => "{$count} applications updated successfully"
        ]);
    }
}