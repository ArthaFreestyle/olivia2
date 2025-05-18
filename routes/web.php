<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RoutesController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/driver', function () {
    return Inertia::render('RouteSubmission');
})->middleware(['auth', 'verified'])->name('driver');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/routes', [RoutesController::class, 'index']);
    Route::post('/routes', [RoutesController::class, 'store']);
    Route::get('/routes/{id}', [RoutesController::class, 'show']);
    Route::put('/routes/{id}', [RoutesController::class, 'update']);
    Route::delete('/routes/{id}', [RoutesController::class, 'destroy']);
});

require __DIR__.'/auth.php';
