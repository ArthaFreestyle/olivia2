<?php

namespace App\Http\Controllers;

use App\Models\Freights;
use App\Models\RoutePoints;
use Illuminate\Http\Request;
use App\Models\Routes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class DriverController extends Controller
{
    public function index()
    {
        $freights = Freights::all();
        $driver = auth()->user()->load('vehicle');
        $routes = auth()->user()->routes;
        return inertia('RouteSubmission', [
            'freights' => $freights,
            'driver' => $driver,
            'routes' => $routes
        ]);
    }

    public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'driver_id' => 'required|exists:drivers,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'freight_id' => 'required|exists:freights,id',
            'name' => 'required|string|max:255',
            'distance' => 'required|numeric',
            'duration' => 'required|numeric',
            'weight' => 'required|numeric',
            'weight_name' => 'required|string|max:100',
            'geometry' => 'required|array',
        ]);

        $route = Routes::create([
            'driver_id' => $request->input('driver_id'),
            'vehicle_id' => $request->input('vehicle_id'),
            'freight_id' => $request->input('freight_id'),
            'name' => $request->input('name'),
            'distance' => $request->input('distance') / 1000, // Convert meters to km
            'duration' => $request->input('duration') / 60,   // Convert seconds to minutes
            'geometry' => json_encode($request->input('geometry')),
            'pricing' => $request->input('pricing'),
        ]);

        $route_points = RoutePoints::create([
            'route_id' => $route->id,
            'latitude_start' => $request->input('start_point.lat'),
            'longitude_start' => $request->input('start_point.lng'),
            'latitude_end' => $request->input('end_point.lat'),
            'longitude_end' => $request->input('end_point.lng'),
        ]);

        return response()->json(['message' => 'Route created successfully', 'route' => $route,'route_points' => $route_points], 201);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Server Error',
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
}


public function getRoute()
{
    try {
        $routes = Routes::with('points')->get();

        if ($routes->isNotEmpty()) {
            return response()->json([
                'code' => 'Ok',
                'routes' => $routes->map(function ($route) {
                    return [
                        'geometry' => json_decode($route->geometry, true),
                        'distance' => $route->distance,
                        'duration' => $route->duration,
                        'points' => $route->points,
                    ];
                })->values(), // pastikan hasilnya ter-serialisasi dengan baik
            ]);
        }

        return response()->json([
            'code' => 'Ok',
            'routes' => [],
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'code' => 'Error',
            'message' => $e->getMessage(),
        ], 500);
    }
}
}
