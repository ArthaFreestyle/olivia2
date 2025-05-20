<?php

namespace App\Http\Controllers;

use App\Models\Freights;
use Illuminate\Http\Request;
use App\Models\Routes;

class DriverController extends Controller
{
    public function index()
    {
        $freights = Freights::all();
        $driver = auth()->user()->load('vehicle');
        return inertia('RouteSubmission', [
            'freights' => $freights,
            'driver' => $driver
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

        $route = Routes::create($validated);

        return response()->json(['message' => 'Route created successfully', 'route' => $route], 201);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Server Error',
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
}


}
