<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    protected $table = 'evaluations';

    // evaluations table HAS created_at but no updated_at
    const UPDATED_AT = null;

    protected $fillable = [
        'application_id',
        'overall',
        'technical',
        'communication',
        'teamwork',
        'initiative',
        'comment',
        'completed',
        'certificate',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'completed'   => 'boolean',
        'certificate' => 'boolean',
        'start_date'  => 'date',
        'end_date'    => 'date',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }
}