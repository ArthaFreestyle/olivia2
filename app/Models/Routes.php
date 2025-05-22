<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Drivers;


class Routes extends Model
{
    protected $fillable = [
        'driver_id', 'vehicle_id', 'max_weight', 'name',
        'distance', 'duration', 'geometry','pricing',
    ];

    protected $casts = [
        'geometry' => 'array',
    ];

    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicles::class);
    }

    public function freight(): BelongsTo
    {
        return $this->belongsTo(Freights::class);
    }

    public function points(): HasMany
    {
        return $this->hasMany(RoutePoints::class, 'route_id');
    }
}
