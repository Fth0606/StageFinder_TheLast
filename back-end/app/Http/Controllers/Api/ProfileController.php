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
     * students table: id, user_id, university, specialite, graduation_year, skills, cv_path, phone, location
     * users table: id, name, email, password, role, bio, profile_picture
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name'         => 'sometimes|string|max:255',
            'email'        => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            'bio'          => 'nullable|string',
            'password'     => 'nullable|string|min:6',
            'education'    => 'nullable|string|max:150', // → university
            'field'        => 'nullable|string|max:100', // → specialite
            'skills'       => 'nullable|array',
            'phone'        => 'nullable|string|max:20',  // → students.phone
            'location'     => 'nullable|string|max:150', // → students.location
            'company_name' => 'nullable|string|max:150',
            'industry'     => 'nullable|string|max:100',
            'description'  => 'nullable|string',
            'website'      => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update users table
        $userData = [];
        if ($request->filled('name'))     $userData['name']  = $request->name;
        if ($request->filled('email'))    $userData['email'] = $request->email;
        if ($request->has('bio'))         $userData['bio']   = $request->bio;
        if ($request->filled('password')) $userData['password'] = Hash::make($request->password);
        if (!empty($userData)) $user->update($userData);

        // Update students table
        if ($user->role === 'student') {
            $studentData = [];
            if ($request->has('education')) $studentData['university'] = $request->education;
            if ($request->has('field'))     $studentData['specialite'] = $request->field;
            if ($request->has('phone'))     $studentData['phone']      = $request->phone;
            if ($request->has('location'))  $studentData['location']   = $request->location;
            if ($request->has('skills'))    $studentData['skills']     = $request->skills;

            if (!empty($studentData)) {
                if ($user->student) {
                    $user->student->update($studentData);
                } else {
                    Student::create(array_merge([
                        'user_id'    => $user->id,
                        'university' => 'Non renseigné',
                        'specialite' => 'Non renseigné',
                    ], $studentData));
                }
            }
        }

        // Update companies table
        if ($user->role === 'company' && $user->company) {
            $companyData = [];
            if ($request->filled('company_name')) $companyData['company_name'] = $request->company_name;
            if ($request->filled('industry'))     $companyData['industry']     = $request->industry;
            if ($request->filled('location'))     $companyData['location']     = $request->location;
            if ($request->filled('description'))  $companyData['description']  = $request->description;
            if ($request->filled('website'))      $companyData['website']      = $request->website;
            if ($request->filled('phone'))        $companyData['phone']        = $request->phone;
            if (!empty($companyData)) $user->company->update($companyData);
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => $user->fresh()->load(['student', 'company']),
        ]);
    }

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
            'location'        => 'nullable|string|max:150',
            'phone'           => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->filled('bio')) $user->update(['bio' => $request->bio]);

        Student::updateOrCreate(
            ['user_id' => $user->id],
            [
                'university'      => $request->university,
                'specialite'      => $request->specialite,
                'graduation_year' => $request->graduation_year,
                'skills'          => $request->skills ?? [],
                'location'        => $request->location,
                'phone'           => $request->phone,
            ]
        );

        return response()->json([
            'message' => 'Student profile completed successfully',
            'user'    => $user->fresh()->load('student'),
        ]);
    }

    public function completeCompanyProfile(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'company') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:150',
            'industry'     => 'nullable|string|max:100',
            'location'     => 'nullable|string|max:150',
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

    public function applications(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'student' || !$user->student) {
            return response()->json([]);
        }

        $applications = $user->student->applications()
            ->with('offer.company')
            ->latest('applied_at')
            ->get();

        return response()->json($applications);
    }

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

        if ($student->cv_path) Storage::disk('public')->delete($student->cv_path);

        $path = $request->file('cv')->store('cvs', 'public');
        $student->update(['cv_path' => $path]);

        return response()->json(['message' => 'CV uploaded successfully', 'cv_path' => $path]);
    }

    /**
     * Delete student CV
     */
    public function deleteCv(Request $request)
    {
        $user    = $request->user();
        $student = \App\Models\Student::where('user_id', $user->id)->first();

        if (!$student) return response()->json(['message' => 'Student profile not found'], 404);

        if ($student->cv_path) {
            Storage::disk('public')->delete($student->cv_path);
            $student->update(['cv_path' => null]);
        }

        return response()->json(['message' => 'CV deleted successfully']);
    }
}