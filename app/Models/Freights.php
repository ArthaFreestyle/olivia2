<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use App\Models\Routes;
use App\Models\FreightUserWeights;
class Freights extends Model
{
    // protected $fillable = ['description', 'total_weight_kg', 'volume_m3', 'created_by_user_id'];

    protected $guard = [

    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function userWeights(): HasMany
    {
        return $this->hasMany(FreightUserWeights::class);
    }

    public function routes(): HasMany
    {
        return $this->hasMany(Routes::class);
    }
}
