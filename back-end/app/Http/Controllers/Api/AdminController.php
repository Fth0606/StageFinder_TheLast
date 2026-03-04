<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Offer;
use App\Models\Company;
use App\Models\Student;
use App\Models\Application;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function stats()
    {
        $stats = [
            'totalUsers'        => User::count(),
            'totalStages'       => Offer::count(),
            'totalCompanies'    => Company::count(),
            'totalApplications' => Application::count(),
            'newUsersThisMonth' => User::whereMonth('created_at', date('m'))
                                       ->whereYear('created_at', date('Y'))->count(),
            'activeStages'      => Offer::where('status', 'approved')->count(),
            'pendingStages'     => Offer::where('status', 'pending')->count(),
            'rejectedStages'    => Offer::where('status', 'rejected')->count(),
            'applicationsToday' => Application::whereDate('applied_at', today())->count(),
            'studentCount'      => User::where('role', 'student')->count(),
            'companyCount'      => User::where('role', 'company')->count(),
            'adminCount'        => User::where('role', 'admin')->count(),
        ];

        // Real monthly data — last 6 months from DB
        $monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
                       'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        $monthlyData = [];

        for ($i = 5; $i >= 0; $i--) {
            $date  = now()->subMonths($i);
            $month = $date->month;
            $year  = $date->year;

            $monthlyData[] = [
                'name'         => $monthNames[$month - 1],
                'stages'       => Offer::whereMonth('created_at', $month)
                                       ->whereYear('created_at', $year)->count(),
                'users'        => User::whereMonth('created_at', $month)
                                      ->whereYear('created_at', $year)->count(),
                'applications' => Application::whereMonth('applied_at', $month)
                                             ->whereYear('applied_at', $year)->count(),
            ];
        }

        // Recent activities
        $recentActivities = collect();

        User::latest()->take(5)->get()->each(function($user) use (&$recentActivities) {
            $recentActivities->push([
                'type'      => 'user',
                'message'   => "Nouvel utilisateur inscrit: {$user->name}",
                'timestamp' => $user->created_at,
            ]);
        });

        Offer::with('company')->latest()->take(5)->get()->each(function($offer) use (&$recentActivities) {
            $recentActivities->push([
                'type'      => 'offer',
                'message'   => "Nouvelle offre: {$offer->title} par " . ($offer->company->company_name ?? 'N/A'),
                'timestamp' => $offer->created_at,
            ]);
        });

        $recentActivities = $recentActivities->sortByDesc('timestamp')->take(10)->values();

        return response()->json([
            'stats'             => $stats,
            'monthly_data'      => $monthlyData,
            'recent_activities' => $recentActivities,
        ]);
    }

    public function users(Request $request)
    {
        $query = User::with(['student', 'company']);

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        return response()->json($query->latest()->get());
    }

    public function updateUserStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,suspended',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);
        return response()->json(['message' => 'User status updated', 'user' => $user]);
    }

    public function deleteUser(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot delete yourself'], 400);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function offers(Request $request)
    {
        $query = Offer::with('company.user');
        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('search')) $query->where('title', 'like', "%{$request->search}%");
        return response()->json($query->latest()->get());
    }

    public function updateOfferStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected,pending',
        ]);
        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $offer = Offer::find($id);
        if (!$offer) return response()->json(['message' => 'Offer not found'], 404);
        $offer->update(['status' => $request->status]);
        return response()->json(['message' => 'Offer status updated', 'offer' => $offer]);
    }

    public function deleteOffer(Request $request, $id)
    {
        $offer = Offer::find($id);
        if (!$offer) return response()->json(['message' => 'Offer not found'], 404);
        $offer->delete();
        return response()->json(['message' => 'Offer deleted successfully']);
    }

    public function companies(Request $request)
    {
        $query = Company::with('user');
        if ($request->filled('search')) {
            $query->where('company_name', 'like', "%{$request->search}%");
        }
        return response()->json($query->withCount('offers')->get());
    }

    public function verifyCompany(Request $request, $id)
    {
        $company = Company::find($id);
        if (!$company) return response()->json(['message' => 'Company not found'], 404);
        return response()->json(['message' => 'Company verified', 'company' => $company->load('user')]);
    }

    public function createAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $admin = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'admin',
        ]);

        return response()->json(['message' => 'Admin created', 'user' => $admin], 201);
    }
}