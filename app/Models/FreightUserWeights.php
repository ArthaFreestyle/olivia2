<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Freight;
use App\Models\User;

class FreightUserWeights extends Model
{
    protected $fillable = ['routes_id', 'user_id', 'contributed_weight_kg'];

    public function freight(): BelongsTo
    {
        return $this->belongsTo(Routes::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
