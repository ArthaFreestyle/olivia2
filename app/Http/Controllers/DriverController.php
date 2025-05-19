<?php

namespace App\Http\Controllers;

use App\Models\Freights;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    public function index()
    {
        $freights = Freights::all();
        $driver = auth()->user();
        return inertia('RouteSubmission', [
            'freights' => $freights,
            'driver' => $driver
        ]);
    }

}
