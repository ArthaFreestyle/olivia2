<?php

use App\Http\Controllers\Api\RoutesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\DriverController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/myroutes', [RoutesController::class, 'index'])->name('myroutes');

Route::get('api/routes', [DriverController::class, 'getRoute']);




