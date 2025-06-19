<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProviderController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\IsAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OutletController;
use App\Http\Controllers\Api\ReviewController;

// Registro público
Route::post('/register', [AuthController::class, 'register']);

// Login
Route::post('/login', [AuthController::class, 'login']);

// Logout
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Rutas protegidas
Route::middleware('auth:sanctum', IsAdmin::class)->group(function () {
    // Users
    Route::apiResource('users', UserController::class);

    // Providers
    Route::apiResource('providers', ProviderController::class);

    // // Obtener usuario autenticado
    // Route::get('/user', [AuthController::class, 'index']);

    // Products
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);

    // Outlet
    Route::apiResource('outlet', OutletController::class)->except(['index', 'show', 'update']);
});

Route::apiResource('products', ProductController::class)->only(['index', 'show']); // pública

Route::apiResource('outlet', OutletController::class)->only(['index', 'show']); // pública

Route::apiResource('reviews', ReviewController::class)->only(['index', 'show']); // pública

Route::middleware('auth:sanctum')->group(function () {
    // Obtener usuario autenticado
    Route::get('/user', [AuthController::class, 'index']);

    Route::apiResource('reviews', ReviewController::class)->except(['index', 'show']);
});


Route::middleware('auth:sanctum')->apiResource('orders', OrderController::class)->except(['update']);
Route::middleware('auth:sanctum', IsAdmin::class)->patch('orders/{id}/status', [OrderController::class, 'updateStatus']);
