<?php

namespace App\Http\Controllers\Api;

use App\Models\Application;
use App\Models\Evaluation;
use App\Models\Student;
use App\Models\Company;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    /**
     * Get applications
     * - Company: all applications for their offers
     * - Student: their own applications
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'company') {
            $company = Company::where('user_id', $user->id)->first();
            if (!$company) return response()->json([]);

            $applications = Application::whereHas('offer', function($q) use ($company) {
                    $q->where('company_id', $company->id);
                })
                ->with([
                    'student.user',
                    'student',
                    'offer',
                    'evaluation', // company's evaluation of this application
                ])
                ->orderBy('applied_at', 'desc')
                ->get();

            return response()->json($applications);
        }

        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->first();
            if (!$student) return response()->json([]);

            $applications = Application::where('student_id', $student->id)
                ->with(['offer.company', 'evaluation'])
                ->orderBy('applied_at', 'desc')
                ->get();

            return response()->json($applications);
        }

        return response()->json([]);
    }

    /**
     * Get single application
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $application = Application::with(['student.user', 'student', 'offer.company'])->find($id);

        if (!$application) return response()->json(['message' => 'Not found'], 404);

        // Only company that owns the offer or the student who applied can view
        $company = $user->role === 'company'
            ? Company::where('user_id', $user->id)->first()
            : null;
        $student = $user->role === 'student'
            ? Student::where('user_id', $user->id)->first()
            : null;

        $canView = ($company && $application->offer->company_id === $company->id)
                || ($student && $application->student_id === $student->id);

        if (!$canView) return response()->json(['message' => 'Unauthorized'], 403);

        return response()->json($application);
    }

    /**
     * Submit application (student only)
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Only students can apply'], 403);
        }

        $validator = Validator::make($request->all(), [
            'offer_id'     => 'required|integer|exists:offers,id',
            'cover_letter' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $student = Student::where('user_id', $user->id)->first();
        if (!$student) {
            return response()->json(['message' => 'Student profile not found. Please complete your profile first.'], 404);
        }

        // Check for duplicate application
        $existing = Application::where('student_id', $student->id)
            ->where('offer_id', $request->offer_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Vous avez déjà postulé à cette offre'], 422);
        }

        $application = Application::create([
            'student_id'   => $student->id,
            'offer_id'     => $request->offer_id,
            'cover_letter' => $request->cover_letter,
            'status'       => 'pending',
            'applied_at'   => now(),
        ]);

        return response()->json([
            'message'     => 'Candidature envoyée avec succès',
            'application' => $application->load(['offer.company', 'student.user']),
        ], 201);
    }

    /**
     * Update application status (company or admin)
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:accepted,rejected,pending',
        ]);
        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $application = Application::with('offer')->find($id);
        if (!$application) return response()->json(['message' => 'Not found'], 404);

        // Verify company owns this offer
        if ($user->role === 'company') {
            $company = Company::where('user_id', $user->id)->first();
            if (!$company || $application->offer->company_id !== $company->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $application->update(['status' => $request->status]);
        return response()->json(['message' => 'Status updated', 'application' => $application]);
    }

    /**
     * Withdraw application (student only)
     */
    public function withdraw(Request $request, $id)
    {
        $user = $request->user();
        $student = Student::where('user_id', $user->id)->first();

        $application = Application::find($id);
        if (!$application) return response()->json(['message' => 'Not found'], 404);
        if (!$student || $application->student_id !== $student->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $application->delete();
        return response()->json(['message' => 'Candidature retirée']);
    }

    /**
     * Delete application (admin only)
     */
    public function destroy(Request $request, $id)
    {
        $application = Application::find($id);
        if (!$application) return response()->json(['message' => 'Not found'], 404);
        $application->delete();
        return response()->json(['message' => 'Application deleted']);
    }

    /**
     * Get statistics
     */
    public function statistics(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'company') {
            $company = Company::where('user_id', $user->id)->first();
            if (!$company) return response()->json([]);

            $offerIds = $company->offers()->pluck('id');
            return response()->json([
                'total'    => Application::whereIn('offer_id', $offerIds)->count(),
                'pending'  => Application::whereIn('offer_id', $offerIds)->where('status', 'pending')->count(),
                'accepted' => Application::whereIn('offer_id', $offerIds)->where('status', 'accepted')->count(),
                'rejected' => Application::whereIn('offer_id', $offerIds)->where('status', 'rejected')->count(),
            ]);
        }

        return response()->json([]);
    }

    /**
     * Submit or update evaluation for an application (company only)
     */
    public function submitEvaluation(Request $request, $applicationId)
    {
        $user    = $request->user();
        $company = Company::where('user_id', $user->id)->first();

        if (!$company) return response()->json(['message' => 'Unauthorized'], 403);

        $application = Application::with('offer')->find($applicationId);
        if (!$application) return response()->json(['message' => 'Not found'], 404);
        if ($application->offer->company_id !== $company->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $evaluation = Evaluation::updateOrCreate(
            ['application_id' => $applicationId],
            [
                'overall'       => $request->overall       ?? 0,
                'technical'     => $request->technical     ?? 0,
                'communication' => $request->communication ?? 0,
                'teamwork'      => $request->teamwork       ?? 0,
                'initiative'    => $request->initiative     ?? 0,
                'comment'       => $request->comment,
                'completed'     => $request->completed     ?? false,
                'certificate'   => $request->certificate   ?? false,
                'start_date'    => $request->start_date,
                'end_date'      => $request->end_date,
            ]
        );

        return response()->json(['message' => 'Evaluation saved', 'evaluation' => $evaluation]);
    }

    public function bulkUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids'    => 'required|array',
            'status' => 'required|in:accepted,rejected,pending',
        ]);
        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        Application::whereIn('id', $request->ids)->update(['status' => $request->status]);
        return response()->json(['message' => 'Applications updated']);
    }
}