<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Routes;

class Vehicles extends Model
{
     protected $fillable = ['type', 'plate_number','owner'];

    public function routes(): HasMany
    {
        return $this->hasMany(Routes::class);
    }
    public function owned()
    {
        return $this->belongsTo(User::class, 'owner');
    }
}
