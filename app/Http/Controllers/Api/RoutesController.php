<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Routes;
use Illuminate\Http\Request;

class RoutesController extends Controller
{
    public function index()
    {
        $routes = Routes::with(['driver', 'vehicle', 'freight', 'points'])->get();
        return response()->json($routes);
    }

   public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'driver_id' => 'required',
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


    public function show($id)
    {
        $route = Routes::with(['driver', 'vehicle', 'freight', 'points'])->find($id);

        if (! $route) {
            return response()->json(['message' => 'Route not found'], 404);
        }

        return response()->json($route);
    }

    public function update(Request $request, $id)
    {
        $route = Routes::find($id);

        if (! $route) {
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

        if (! $route) {
            return response()->json(['message' => 'Route not found'], 404);
        }

        $route->delete();

        return response()->json(['message' => 'Route deleted successfully']);
    }
}
