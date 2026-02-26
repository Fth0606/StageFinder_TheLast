<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    protected $table = 'messages';

    protected $fillable = ['conversation_id', 'sender_id', 'message', 'is_read'];

    protected $casts = [
        'is_read' => 'boolean',
        'sent_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the conversation that the message belongs to.
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Get the sender of the message.
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Scope a query to only include unread messages.
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope a query to only include messages from a specific sender.
     */
    public function scopeFromSender($query, $senderId)
    {
        return $query->where('sender_id', $senderId);
    }

    /**
     * Mark the message as read.
     */
    public function markAsRead(): void
    {
        $this->update(['is_read' => true]);
    }
}