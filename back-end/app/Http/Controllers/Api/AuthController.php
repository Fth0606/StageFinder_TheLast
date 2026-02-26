<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Student;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request): JsonResponse
    {
        \Log::info('Registration attempt:', $request->all());

        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'userType' => 'required|in:student,company',
        ]);

        if ($validator->fails()) {
            \Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            // Create user
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => $request->userType,
            ]);

            \Log::info('User created:', ['id' => $user->id, 'email' => $user->email]);

            // Create profile based on user type
            if ($request->userType === 'student') {
                Student::create([
                    'user_id'    => $user->id,
                    'university' => 'Non renseigné',   // NOT NULL — placeholder until profile is completed
                    'specialite' => 'Non renseigné',   // NOT NULL — placeholder until profile is completed
                ]);
                \Log::info('Student profile created for user:', ['user_id' => $user->id]);
            } else {
                Company::create([
                    'user_id'      => $user->id,
                    'company_name' => $request->name,
                    'location'     => 'Non renseigné', // NOT NULL — placeholder until profile is completed
                ]);
                \Log::info('Company profile created for user:', ['user_id' => $user->id]);
            }

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'user'    => $user,
                'token'   => $token
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Registration error:', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Registration failed',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Load relationships based on role
        if ($user->role === 'student') {
            $user->load('student');
        } elseif ($user->role === 'company') {
            $user->load('company');
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user'    => $user,
            'token'   => $token
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();

        // Load profile based on role
        if ($user->role === 'student') {
            $user->load('student');
        } elseif ($user->role === 'company') {
            $user->load('company');
        }

        return response()->json($user);
    }
}