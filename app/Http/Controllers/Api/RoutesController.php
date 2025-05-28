<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FreightUserWeights;
use App\Models\Routes;
use Illuminate\Http\Request;
use App\Models\RoutePoints;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\Freights;
use Carbon\Carbon;

class RoutesController extends Controller
{
    public function index()
    {
        $driver = auth()->user()->load('routes');
        return response()->json([
            'routes' => $driver
        ]);
    }

    public function store(Request $request)
    {
        try {
            // Validate input
            $validated = $request->validate([
                'driver_id' => 'required', // Ensure driver_id exists in drivers table
                'vehicle_id' => 'required|integer|exists:vehicles,id', // Ensure vehicle_id exists in vehicles table
                'freight_id' => 'required', // Ensure freight_id exists in freights table
                'name' => 'required|string|max:255',
                'distance' => 'required|numeric|min:0', // Ensure non-negative distance in meters
                'duration' => 'required|numeric|min:0', // Ensure non-negative duration in seconds
                'geometry' => 'required|array', // Ensure geometry is an array
                'start_point.lat' => 'required|numeric|between:-90,90', // Validate latitude
                'start_point.lng' => 'required|numeric|between:-180,180', // Validate longitude
                'end_point.lat' => 'required|numeric|between:-90,90', // Validate latitude
                'end_point.lng' => 'required|numeric|between:-180,180', // Validate longitude
                'pricing' => 'required|numeric|min:0', // Ensure non-negative pricing
            ]);

            $max = Freights::where('id', $request->input('freight_id'))->first();
            // Create route
            $departureDateTime = $request->input('departure_date') . ' ' . $request->input('departure_time');
            $jadwal = Carbon::parse($departureDateTime)->format('Y-m-d H:i:s');
            $route = Routes::create([
                'driver_id' => $request->input('driver_id'),
                'vehicle_id' => $request->input('vehicle_id'),
                'max_weight' => $max->max_weight_kg,
                'name' => $request->input('name'),
                'distance' => $request->input('distance'), // Convert meters to km
                'duration' => $request->input('duration'), // Convert seconds to minutes
                'geometry' => json_encode($request->input('geometry')), // Store as JSON
                'pricing' => $request->input('pricing'), // Store as JSON
                'Jadwal' => $jadwal
            ]);

            // Create route points
            $route_points = RoutePoints::create([
                'route_id' => $route->id, // Ensure this is an integer
                'latitude_start' => (float) $request->input('start_point.lat'), // Cast to float
                'longitude_start' => (float) $request->input('start_point.lng'), // Cast to float
                'latitude_end' => (float) $request->input('end_point.lat'), // Cast to float
                'longitude_end' => (float) $request->input('end_point.lng'), // Cast to float
            ]);

            $freights = Freights::all();
            $driver = auth()->user()->load('vehicle');
            $routes = auth()->user()->routes;
            return inertia('RouteSubmission', [
                'freights' => $freights,
                'driver' => $driver,
                'routes' => $routes
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Log the error for debugging

            return response()->json([
                'message' => 'Server Error',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }


    public function show($id)
    {
        $route = Routes::with(['driver', 'vehicle', 'weightNow', 'points'])->find($id);

        if (!$route) {
            return response()->json(['message' => 'Route not found'], 404);
        }

        return response()->json($route);
    }

    public function update(Request $request, $id)
    {
        $route = Routes::find($id);

        if (!$route) {
            return response()->json(['message' => 'Route not found'], 404);
        }

        $validated = $request->validate([
            'driver_id' => 'sometimes|exists:drivers,id',
            'vehicle_id' => 'sometimes|exists:vehicles,id',
            'freight_id' => 'sometimes|exists:freights,id',
            'name' => 'sometimes|string|max:255',
            'distance' => 'sometimes|numeric',
            'duration' => 'sometimes|numeric',
            'weight' => 'sometimes|numeric',
            'weight_name' => 'sometimes|string|max:100',
            'geometry' => 'sometimes|array',
        ]);

        $route->update($validated);

        return response()->json(['message' => 'Route updated successfully', 'route' => $route]);
    }

    public function destroy($id)
    {
        $route = Routes::find($id);

        if (!$route) {
            return response()->json(['message' => 'Route not found'], 404);
        }

        $route->delete();

        return response()->json(['message' => 'Route deleted successfully']);
    }

    public function storeLoad(Request $request)
    {
        $validated = $request->validate([
            'route_id' => 'required|exists:routes,id',
            'weight' => 'required|numeric|min:0',
            'user_id' => 'required',
        ]);

        $load = FreightUserWeights::create([
            'routes_id' => $validated['route_id'],
            'user_id' => $validated['user_id'],
            'contributed_weight_kg' => $validated['weight'],
        ]);

        return response()->json(['message' => 'Load added successfully']);
    }
}
