<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConversationParticipant extends Model
{
    protected $table = 'conversation_participants';
    
    protected $fillable = ['conversation_id', 'user_id'];

    protected $casts = [
        'joined_at' => 'datetime',
    ];

    /**
     * Get the conversation that the participant belongs to.
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Get the user that is a participant.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}