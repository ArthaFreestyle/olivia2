<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

use App\Http\Controllers\Api\RoutesController;

Route::post('/register', [AuthController::class, 'register'])->name('api.register');
Route::post('/login', [AuthController::class, 'login'])->name('api.login');

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});


Route::middleware('auth:api')->group(function () {
    Route::get('/routes', [RoutesController::class, 'index']);
    Route::post('/routes', [RoutesController::class, 'store']);
    Route::get('/routes/{id}', [RoutesController::class, 'show']);
    Route::put('/routes/{id}', [RoutesController::class, 'update']);
    Route::delete('/routes/{id}', [RoutesController::class, 'destroy']);
});


