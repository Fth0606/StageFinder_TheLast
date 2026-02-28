<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    protected $table = 'applications';

    public $timestamps = false; // applications table has no created_at/updated_at columns

    protected $fillable = [
        'student_id',
        'offer_id',
        'cover_letter',
        'cv_file',
        'status',
        'applied_at',
    ];

    protected $casts = [
        'applied_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class);
    }

    public function evaluation()
    {
        return $this->hasOne(\App\Models\Evaluation::class);
    }
}