<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verifica si el usuario está autenticado
        if (!Auth::check()) {
            return response()->json(['message' => 'Not authenticated'], 401);
        }

        // Verifica si es admin (el token se creó con nombre 'admin-token')
        if ($request->user()->currentAccessToken()->name === 'admin-token') {
            return $next($request);
        }

        // Si no es admin
        return response()->json(['message' => 'Unauthorized'], 403);
    }
}
