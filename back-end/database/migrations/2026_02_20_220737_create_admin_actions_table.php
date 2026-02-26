<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->enum('action_type', ['approve_offer', 'reject_offer', 'delete_user', 'delete_offer', 'verify_company', 'update_user_status', 'other'])->default('other');
            $table->enum('target_type', ['user', 'offer', 'company', 'student'])->nullable();
            $table->unsignedBigInteger('target_id')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->index(['action_type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_actions');
    }
};