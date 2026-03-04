<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\MessageController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public offers
Route::get('/offers', [OfferController::class, 'index']);
Route::get('/offers/{id}', [OfferController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/applications', [ProfileController::class, 'applications']);
    
    // Profiles
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::post('/student', [ProfileController::class, 'completeStudentProfile']);
        Route::post('/complete-company', [ProfileController::class, 'completeCompanyProfile']);
        Route::post('/upload-photo', [ProfileController::class, 'uploadPhoto']);
        Route::post('/upload-cv', [ProfileController::class, 'uploadCv']);
        Route::delete('/delete-cv', [ProfileController::class, 'deleteCv']);
        Route::get('/download-cv/{userId}', [ProfileController::class, 'downloadCv']);
    });
    
    // Offers (Company only)
    Route::post('/offers', [OfferController::class, 'store'])->middleware('role:company');
    Route::put('/offers/{id}', [OfferController::class, 'update'])->middleware('role:company');
    Route::delete('/offers/{id}', [OfferController::class, 'destroy'])->middleware('role:company,admin');
    Route::get('/my-offers', [OfferController::class, 'myOffers'])->middleware('auth:sanctum');
    
    // Applications
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::get('/applications/statistics', [ApplicationController::class, 'statistics']);
    Route::get('/applications/{id}', [ApplicationController::class, 'show']);
    Route::post('/applications', [ApplicationController::class, 'store'])->middleware('role:student');
    Route::put('/applications/{id}', [ApplicationController::class, 'update'])->middleware('role:company,admin');
    Route::post('/applications/bulk-update', [ApplicationController::class, 'bulkUpdate'])->middleware('role:company,admin');
    Route::post('/applications/{id}/evaluation', [ApplicationController::class, 'submitEvaluation'])->middleware('role:company');
    Route::post('/applications/{id}/withdraw', [ApplicationController::class, 'withdraw'])->middleware('role:student');
    Route::delete('/applications/{id}', [ApplicationController::class, 'destroy'])->middleware('role:admin');
    
    // Messages
    Route::get('/conversations', [MessageController::class, 'index']);
    Route::get('/conversations/unread', [MessageController::class, 'unreadCount']);
    Route::get('/conversations/{id}', [MessageController::class, 'show']);
    Route::post('/conversations', [MessageController::class, 'store']);
    Route::post('/conversations/{id}/messages', [MessageController::class, 'sendMessage']);
    Route::put('/conversations/{id}/read', [MessageController::class, 'markAsRead']);
    
    // Admin routes
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::put('/users/{id}/status', [AdminController::class, 'updateUserStatus']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/offers', [AdminController::class, 'offers']);
        Route::put('/offers/{id}/status', [AdminController::class, 'updateOfferStatus']);
        Route::delete('/offers/{id}', [AdminController::class, 'deleteOffer']);
        Route::get('/companies', [AdminController::class, 'companies']);
        Route::put('/companies/{id}/verify', [AdminController::class, 'verifyCompany']);
        Route::post('/admins', [AdminController::class, 'createAdmin']);
        Route::get('/logs', [AdminController::class, 'actionLogs']);
    });

    

});