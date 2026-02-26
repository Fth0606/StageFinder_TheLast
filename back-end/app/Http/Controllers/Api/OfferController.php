<?php

namespace App\Http\Controllers\Api;

use App\Models\Offer;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class OfferController extends Controller
{
    /**
     * Get all offers — ONLY approved (public/student view)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Offer::with('company.user')
                      ->where('status', 'approved'); // ← only approved visible publicly

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('company', function($q2) use ($search) {
                      $q2->where('company_name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        if ($request->filled('domain')) {
            $domain = $request->domain;
            $query->where(function($q) use ($domain) {
                $q->where('title', 'like', "%{$domain}%")
                  ->orWhere('description', 'like', "%{$domain}%");
            });
        }

        if ($request->filled('duration')) {
            $duration = $request->duration;
            if ($duration === '<3') {
                $query->where('duration', '<', 3);
            } elseif ($duration === '3-6') {
                $query->whereBetween('duration', [3, 6]);
            } elseif ($duration === '>6') {
                $query->where('duration', '>', 6);
            }
        }

        if ($request->filled('type')) {
            $typeMap = ['fulltime' => 'full-time', 'remote' => 'remote', 'paid' => 'part-time'];
            $query->where('type', $typeMap[$request->type] ?? $request->type);
        }

        if ($request->filled('limit')) {
            $query->limit((int) $request->limit);
        }

        $offers = $query->latest()->get()->transform(function($offer) {
            $offer->duration_display = $offer->duration !== null ? $offer->duration . ' M' : null;
            return $offer;
        });

        return response()->json($offers);
    }

    /**
     * Get a single offer — only if approved (public view)
     */
    public function show($id): JsonResponse
    {
        $offer = Offer::with('company.user')
                      ->where('status', 'approved')
                      ->find($id);

        if (!$offer) {
            return response()->json(['message' => 'Offer not found'], 404);
        }

        $data = $offer->toArray();
        $data['duration_display'] = $offer->duration !== null ? $offer->duration . ' M' : null;

        return response()->json($data);
    }

    /**
     * Get company's OWN offers — all statuses (for company dashboard)
     */
    public function myOffers(Request $request): JsonResponse
    {
        $company = Company::where('user_id', $request->user()->id)->first();

        if (!$company) {
            return response()->json(['message' => 'Company profile not found'], 404);
        }

        $offers = Offer::where('company_id', $company->id)
                       ->latest()
                       ->get()
                       ->transform(function($offer) {
                           $offer->duration_display = $offer->duration !== null ? $offer->duration . ' M' : null;
                           return $offer;
                       });

        return response()->json($offers);
    }

    /**
     * Create a new offer — always starts as 'pending'
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title'       => 'required|string|max:200',
            'description' => 'required|string',
            'location'    => 'required|string|max:150',
            'duration'    => 'nullable|integer|min:1|max:24',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $company = Company::where('user_id', $request->user()->id)->first();

        if (!$company) {
            return response()->json(['message' => 'Company profile not found'], 404);
        }

        $offer = Offer::create([
            'company_id'   => $company->id,
            'title'        => $request->title,
            'description'  => $request->description,
            'requirements' => $request->requirements ?? null,
            'location'     => $request->location,
            'duration'     => $request->duration ?? null,
            'type'         => $request->type ?? 'full-time',
            'status'       => 'pending', // always pending until admin approves
        ]);

        return response()->json([
            'message' => 'Votre offre a été soumise et est en attente de validation par un administrateur.',
            'offer'   => $offer,
        ], 201);
    }

    /**
     * Update an offer — resets to pending (needs re-approval)
     */
    public function update(Request $request, $id): JsonResponse
    {
        $offer = Offer::find($id);

        if (!$offer) {
            return response()->json(['message' => 'Offer not found'], 404);
        }

        $company = Company::where('user_id', $request->user()->id)->first();

        if (!$company || $offer->company_id !== $company->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $offer->update(array_merge(
            $request->only(['title', 'description', 'requirements', 'location', 'duration', 'type']),
            ['status' => 'pending'] // reset to pending after any edit
        ));

        return response()->json([
            'message' => 'Offre mise à jour. Elle est en attente de validation par un administrateur.',
            'offer'   => $offer,
        ]);
    }

    /**
     * Delete an offer
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $offer = Offer::find($id);

        if (!$offer) {
            return response()->json(['message' => 'Offer not found'], 404);
        }

        $user    = $request->user();
        $company = Company::where('user_id', $user->id)->first();

        if ($user->role !== 'admin' && (!$company || $offer->company_id !== $company->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $offer->delete();

        return response()->json(['message' => 'Offer deleted successfully']);
    }
}