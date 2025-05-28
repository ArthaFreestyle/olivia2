<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Routes;

class DashboardController extends Controller
{
  
    public function index()
    {
        $logistik = Routes::withSum('weightNow', 'contributed_weight_kg')
            ->with(['driver:id,name', 'vehicle:id,type,plate_number'])
            ->get()
            ->map(function ($route) {
                // Parse geometry JSON string to array
                $geometry = json_decode($route->geometry, true) ?? [
                    'type' => 'LineString',
                    'coordinates' => [
                        [$route->longitude_start ?? 106.73237, $route->latitude_start ?? -6.192765],
                        [$route->longitude_end ?? 106.733672, $route->latitude_end ?? -6.19579]
                    ]
                ];

                // Derive start and end coordinates from geometry or route attributes
                $startCoord = $geometry['coordinates'][0] ?? [$route->longitude_start, $route->latitude_start];
                $endCoord = $geometry['coordinates'][count($geometry['coordinates']) - 1] ?? [$route->longitude_end, $route->latitude_end];

                return [
                    'name' => $route->name,
                    'geometry' => $geometry,
                    'points' => [
                        [
                            'latitude_start' => $startCoord[1],
                            'longitude_start' => $startCoord[0],
                            'latitude_end' => $endCoord[1],
                            'longitude_end' => $endCoord[0]
                        ]
                    ],
                    'distance' => (float) $route->distance * 1000, // Convert km to meters
                    'duration' => (float) $route->duration * 60, // Convert minutes to seconds
                    'driver' => $route->driver ? $route->driver->name : 'Unknown Driver',
                    'vehicle' => $route->vehicle ? $route->vehicle->name : 'Truk Kontainer',
                    'license_plate' => $route->vehicle ? $route->vehicle->license_plate : 'B 1234 KLM',
                    'company' => 'PT Logistik Cepat', // Hardcoded or fetch from related model
                    'max_weight' => $route->max_weight, 
                    'weight_filled' => $route->weight_now_sum_contributed_weight_kg, // Convert kg to tons
                    'pricing' => $route->pricing
                ];
            });

        return Inertia::render('Dashboard', [
            'logistik' => ['routes' => $logistik]
        ]);
    }

}
