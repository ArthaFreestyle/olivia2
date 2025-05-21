<?php

use App\Http\Controllers\DriverController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RoutesController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/abort', function () {
    abort(403,'You are not authorized to access this page.');
})->name('abort');

Route::middleware([ 'auth','Driver'])->group(function () {
    Route::get('/driver', [DriverController::class, 'index'])->name('driver');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth','User'])->name('dashboard');

Route::get('/logout-backdoor', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();

    return redirect('/login')->with('status', 'Logged out via backdoor.');
})->name('logout.backdoor');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/routes', [RoutesController::class, 'store']);
    Route::get('/routes/{id}', [RoutesController::class, 'show']);
    Route::put('/routes/{id}', [RoutesController::class, 'update']);
    Route::delete('/routes/{id}', [RoutesController::class, 'destroy']);
});

require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';
