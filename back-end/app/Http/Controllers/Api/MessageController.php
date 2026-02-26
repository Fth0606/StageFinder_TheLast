<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Company;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    /**
     * Get all conversations for authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $conversations = Conversation::whereHas('participants', function($q) use ($user) {
            $q->where('user_id', $user->id);
        })
        ->with([
            'participants.user',
            'lastMessage',
            'offer'
        ])
        ->withCount(['messages as unread_count' => function($q) use ($user) {
            $q->where('is_read', false)
              ->where('sender_id', '!=', $user->id);
        }])
        ->orderBy('updated_at', 'desc')
        ->get();

        // Format conversations for frontend
        $formatted = $conversations->map(function($conv) use ($user) {
            $otherParticipant = $conv->participants
                ->filter(function($p) use ($user) {
                    return $p->user_id !== $user->id;
                })
                ->first();

            $otherUser = $otherParticipant ? $otherParticipant->user : null;
            $company = $otherUser ? Company::where('user_id', $otherUser->id)->first() : null;

            return [
                'id' => $conv->id,
                'companyId' => $company->id ?? null,
                'companyName' => $company->company_name ?? ($otherUser->name ?? 'Utilisateur'),
                'companyLogo' => $company->logo_path ? asset('storage/' . $company->logo_path) : null,
                'internshipId' => $conv->offer_id,
                'internshipTitle' => $conv->offer->title ?? 'Conversation générale',
                'status' => $conv->status,
                'lastMessage' => $conv->lastMessage->message ?? '',
                'lastMessageAt' => $conv->updated_at,
                'unreadCount' => $conv->unread_count,
            ];
        });

        return response()->json($formatted);
    }

    /**
     * Get single conversation with all messages
     */
    public function show(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        $conversation = Conversation::where('id', $id)
            ->whereHas('participants', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->with([
                'participants.user',
                'messages' => function($q) {
                    $q->with('sender')->orderBy('created_at', 'asc');
                },
                'offer'
            ])
            ->first();

        if (!$conversation) {
            return response()->json(['message' => 'Conversation not found'], 404);
        }

        // Mark messages as read
        Message::where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json($conversation);
    }

    /**
     * Start a new conversation
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'company_id' => 'required|exists:companies,id',
            'offer_id' => 'nullable|exists:offers,id',
            'initial_message' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        // Get company user
        $company = Company::with('user')->find($request->company_id);
        
        if (!$company || !$company->user) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        // Check if conversation already exists
        $existingConversation = Conversation::whereHas('participants', function($q) use ($user, $company) {
            $q->whereIn('user_id', [$user->id, $company->user_id]);
        })
        ->get()
        ->filter(function($conv) use ($user, $company) {
            $participantIds = $conv->participants->pluck('user_id')->toArray();
            return in_array($user->id, $participantIds) && in_array($company->user_id, $participantIds);
        })
        ->first();

        if ($existingConversation) {
            // Add message to existing conversation
            $message = Message::create([
                'conversation_id' => $existingConversation->id,
                'sender_id' => $user->id,
                'message' => $request->initial_message,
                'is_read' => false
            ]);

            return response()->json([
                'message' => 'Message added to existing conversation',
                'conversation' => $existingConversation->load('participants.user', 'messages')
            ], 200);
        }

        // Create new conversation
        DB::beginTransaction();

        try {
            $conversation = Conversation::create([
                'offer_id' => $request->offer_id,
                'status' => 'active'
            ]);

            // Add participants
            ConversationParticipant::create([
                'conversation_id' => $conversation->id,
                'user_id' => $user->id
            ]);

            ConversationParticipant::create([
                'conversation_id' => $conversation->id,
                'user_id' => $company->user_id
            ]);

            // Create initial message
            $message = Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $user->id,
                'message' => $request->initial_message,
                'is_read' => false
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Conversation started successfully',
                'conversation' => $conversation->load('participants.user', 'messages')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to start conversation: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Send a message in a conversation
     */
    public function sendMessage(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        // Check if user is participant
        $conversation = Conversation::where('id', $id)
            ->whereHas('participants', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->first();

        if (!$conversation) {
            return response()->json(['message' => 'Conversation not found or you are not a participant'], 404);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'message' => $request->content,
            'is_read' => false
        ]);

        // Update conversation timestamp
        $conversation->touch();

        // Load sender info
        $message->load('sender');

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $message
        ], 201);
    }

    /**
     * Mark conversation messages as read
     */
    public function markAsRead(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        $conversation = Conversation::where('id', $id)
            ->whereHas('participants', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->first();

        if (!$conversation) {
            return response()->json(['message' => 'Conversation not found'], 404);
        }

        // Mark all messages from other users as read
        $updated = Message::where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'message' => 'Messages marked as read',
            'updated_count' => $updated
        ]);
    }

    /**
     * Get unread count for user
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $user = $request->user();

        $count = Message::whereHas('conversation.participants', function($q) use ($user) {
            $q->where('user_id', $user->id);
        })
        ->where('sender_id', '!=', $user->id)
        ->where('is_read', false)
        ->count();

        return response()->json(['unread_count' => $count]);
    }

    /**
     * Delete a conversation (soft delete or hard delete)
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        $conversation = Conversation::where('id', $id)
            ->whereHas('participants', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->first();

        if (!$conversation) {
            return response()->json(['message' => 'Conversation not found'], 404);
        }

        // Soft delete - just remove user from participants or mark as deleted
        // For now, we'll just remove the user from participants
        ConversationParticipant::where('conversation_id', $conversation->id)
            ->where('user_id', $user->id)
            ->delete();

        // If no participants left, delete the conversation
        $remainingParticipants = ConversationParticipant::where('conversation_id', $conversation->id)->count();
        
        if ($remainingParticipants === 0) {
            $conversation->delete();
        }

        return response()->json(['message' => 'Conversation deleted successfully']);
    }

    /**
     * Search conversations
     */
    public function search(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = $request->get('q', '');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $conversations = Conversation::whereHas('participants', function($q) use ($user) {
            $q->where('user_id', $user->id);
        })
        ->whereHas('messages', function($q) use ($query) {
            $q->where('message', 'LIKE', "%{$query}%");
        })
        ->orWhereHas('offer', function($q) use ($query) {
            $q->where('title', 'LIKE', "%{$query}%");
        })
        ->orWhereHas('participants.user', function($q) use ($query, $user) {
            $q->where('name', 'LIKE', "%{$query}%")
              ->where('id', '!=', $user->id);
        })
        ->with([
            'participants.user',
            'lastMessage',
            'offer'
        ])
        ->withCount(['messages as unread_count' => function($q) use ($user) {
            $q->where('is_read', false)
              ->where('sender_id', '!=', $user->id);
        }])
        ->get();

        return response()->json($conversations);
    }

    /**
     * Archive a conversation
     */
    public function archive(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        $conversation = Conversation::where('id', $id)
            ->whereHas('participants', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->first();

        if (!$conversation) {
            return response()->json(['message' => 'Conversation not found'], 404);
        }

        $conversation->update(['status' => 'archived']);

        return response()->json(['message' => 'Conversation archived successfully']);
    }
}