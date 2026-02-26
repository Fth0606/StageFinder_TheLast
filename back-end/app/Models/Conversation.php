<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    protected $table = 'conversations';

    protected $fillable = ['offer_id', 'status'];

    protected $casts = [
        'status' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the participants of the conversation.
     */
    public function participants(): HasMany
    {
        return $this->hasMany(ConversationParticipant::class);
    }

    /**
     * Get the messages of the conversation.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'asc');
    }

    /**
     * Get the last message of the conversation.
     */
    public function lastMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    /**
     * Get the offer associated with the conversation.
     */
    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class);
    }

    /**
     * Scope a query to only include active conversations.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include archived conversations.
     */
    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }
}