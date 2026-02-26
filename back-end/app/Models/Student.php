<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $table = 'students';

    protected $fillable = [
        'user_id', 
        'university', 
        'specialite', 
        'graduation_year', 
        'skills', 
        'cv_path',
        'phone',      // Make sure these are added
        'location',   // Make sure these are added
    ];

    protected $casts = [
        'skills' => 'array',
        'graduation_year' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}