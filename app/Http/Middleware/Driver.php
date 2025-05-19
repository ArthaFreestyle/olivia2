<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Driver
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(!$request->user() || $request->user()->role !== 'driver') {
            return redirect()->route('abort')->with('error', 'You are not authorized to access this page.');
        }
        return $next($request);
    }
}
