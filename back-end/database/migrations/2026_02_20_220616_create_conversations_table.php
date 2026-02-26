<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offer_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('status', ['active', 'archived'])->default('active');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('conversations');
    }
};