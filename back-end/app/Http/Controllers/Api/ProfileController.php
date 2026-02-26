<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Student;
use App\Models\Company;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Get user profile with related data
     */
    public function show(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'student') {
            $user->load('student');
        } elseif ($user->role === 'company') {
            $user->load('company');
            if ($user->company) {
                $user->company->offers = $user->company->offers()
                    ->withCount('applications')
                    ->latest()
                    ->get();
            }
        }

        return response()->json($user);
    }

    /**
     * Update user profile
     * Accepts fields from EditProfile.js:
     *   name, email, bio, phone, location, education, field, skills (array), password
     * Maps to DB columns:
     *   users: name, email, bio, password
     *   students: university (← education), specialite (← field), skills, location
     */
    /**
 * Update user profile
 */
/**
 * Update user profile
 */
public function update(Request $request)
{
    $user = $request->user();

    $validator = Validator::make($request->all(), [
        'name'      => 'sometimes|string|max:255',
        'email'     => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
        'bio'       => 'nullable|string',
        'password'  => 'nullable|string|min:6',
        // student fields
        'education' => 'nullable|string|max:150',
        'field'     => 'nullable|string|max:100',
        'skills'    => 'nullable|array',
        'phone'     => 'nullable|string|max:20',
        'location'  => 'nullable|string|max:150',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    try {
        \DB::beginTransaction();

        // Update users table
        $userData = [];
        if ($request->filled('name'))   $userData['name'] = $request->name;
        if ($request->filled('email'))  $userData['email'] = $request->email;
        if ($request->filled('bio'))    $userData['bio'] = $request->bio;
        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        if (!empty($userData)) {
            $user->update($userData);
        }

        // Update student profile
        if ($user->role === 'student') {
            $student = $user->student;
            
            if (!$student) {
                $student = Student::create(['user_id' => $user->id]);
            }

            $studentData = [];
            
            if ($request->has('education')) {
                $studentData['university'] = $request->education;
            }
            if ($request->has('field')) {
                $studentData['specialite'] = $request->field;
            }
            if ($request->has('skills')) {
                $studentData['skills'] = $request->skills;
            }
            if ($request->has('phone')) {
                $studentData['phone'] = $request->phone;
            }
            if ($request->has('location')) {
                $studentData['location'] = $request->location;
            }

            if (!empty($studentData)) {
                $student->update($studentData);
            }
        }

        \DB::commit();

        // Return updated user with all relationships
        $user->load('student');
        
        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);

    } catch (\Exception $e) {
        \DB::rollBack();
        \Log::error('Profile update error: ' . $e->getMessage());
        \Log::error('Stack trace: ' . $e->getTraceAsString());
        
        return response()->json([
            'message' => 'Failed to update profile',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Complete student profile after registration
     */
    public function completeStudentProfile(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'university'      => 'required|string|max:150',
            'specialite'      => 'required|string|max:100',
            'graduation_year' => 'nullable|integer|min:1950|max:' . (date('Y') + 5),
            'skills'          => 'nullable|array',
            'bio'             => 'nullable|string',
            'location'        => 'required|string|max:150',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->filled('bio')) {
            $user->update(['bio' => $request->bio]);
        }

        Student::updateOrCreate(
            ['user_id' => $user->id],
            [
                'university'      => $request->university,
                'specialite'      => $request->specialite,
                'graduation_year' => $request->graduation_year,
                'skills'          => $request->skills,
                'location'        => $request->location,
            ]
        );

        return response()->json([
            'message' => 'Student profile completed successfully',
            'user'    => $user->fresh()->load('student'),
        ]);
    }

    /**
     * Complete company profile after registration
     */
    public function completeCompanyProfile(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'company') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:150',
            'industry'     => 'nullable|string|max:100',
            'location'     => 'required|string|max:150',
            'description'  => 'required|string',
            'website'      => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        Company::updateOrCreate(
            ['user_id' => $user->id],
            [
                'company_name' => $request->company_name,
                'industry'     => $request->industry,
                'location'     => $request->location,
                'description'  => $request->description,
                'website'      => $request->website,
            ]
        );

        return response()->json([
            'message' => 'Company profile completed successfully',
            'user'    => $user->fresh()->load('company'),
        ]);
    }

    /**
     * Upload CV for student
     */
    public function uploadCv(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'cv' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        if ($student->cv_path) {
            Storage::disk('public')->delete($student->cv_path);
        }

        $path = $request->file('cv')->store('cvs', 'public');
        $student->update(['cv_path' => $path]);

        return response()->json([
            'message' => 'CV uploaded successfully',
            'cv_path' => $path,
        ]);
    }
}