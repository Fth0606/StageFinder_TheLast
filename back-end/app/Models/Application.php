<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    protected $table = 'applications';

    protected $fillable = [
        'student_id',
        'offer_id',
        'cover_letter',
        'cv_file',
        'status',
        'rejection_reason',
    ];

    protected $casts = [
        'applied_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_REJECTED = 'rejected';
    const STATUS_WITHDRAWN = 'withdrawn';

    /**
     * Get the student that owns the application.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the offer that the application belongs to.
     */
    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class);
    }

    /**
     * Scope a query to only include pending applications.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope a query to only include accepted applications.
     */
    public function scopeAccepted($query)
    {
        return $query->where('status', self::STATUS_ACCEPTED);
    }

    /**
     * Scope a query to only include rejected applications.
     */
    public function scopeRejected($query)
    {
        return $query->where('status', self::STATUS_REJECTED);
    }

    /**
     * Check if application is pending.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if application is accepted.
     */
    public function isAccepted(): bool
    {
        return $this->status === self::STATUS_ACCEPTED;
    }

    /**
     * Check if application is rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    /**
     * Get CV file URL.
     */
    public function getCvUrlAttribute(): ?string
    {
        if ($this->cv_file) {
            return asset('storage/' . $this->cv_file);
        }
        return null;
    }
}