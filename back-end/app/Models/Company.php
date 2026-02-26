<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $table = 'companies';

    protected $fillable = [
        'user_id', 'company_name', 'industry', 'location', 'description', 'website', 'logo_path'
    ];

    /**
     * Get the user that owns the company profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the offers for the company.
     */
    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class);
    }
}