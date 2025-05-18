<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoutePoints extends Model
{
    protected $fillable = [
        'route_id', 'type', 'name',
        'longitude', 'latitude', 'order_index'
    ];

    public function route(): BelongsTo
    {
        return $this->belongsTo(Routes::class);
    }
}
