<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminAction extends Model
{
    protected $table = 'admin_actions';
    
    protected $fillable = [
        'admin_id', 'action_type', 'target_type', 'target_id', 'description'
    ];

    protected $casts = [
        'action_type' => 'string',
        'target_type' => 'string',
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}