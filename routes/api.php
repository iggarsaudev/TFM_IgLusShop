<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Middleware\IsAdmin;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProviderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OutletController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\CategoryController;

// Registro público
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Productos y outlet
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::apiResource('outlet', OutletController::class)->only(['index', 'show']);

// Reseñas
Route::apiResource('reviews', ReviewController::class)->only(['index', 'show']);

// Reseñas por producto
Route::get('/product/{productId}/reviews', [ReviewController::class, 'getByProductId']);


/*
|--------------------------------------------------------------------------
| Rutas protegidas (requieren autenticación con Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum', 'check.token.expiration')->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Renew token
    Route::post('/renew-token', [AuthController::class, 'renewToken']);

    // Perfil de usuario autenticado
    Route::get('/user', [AuthController::class, 'index']);
    Route::put('/user/profile', [UserController::class, 'updateOwnProfile']);
    Route::post('/user/avatar', [UserController::class, 'updateAvatar']);

    // Crear, actualizar y borrar reseñas (excepto index y show que son públicos)
    Route::apiResource('reviews', ReviewController::class)->except(['index', 'show']);

    // Pedidos (usuario autenticado)
    Route::apiResource('orders', OrderController::class)->except(['update']);
});

/*
|--------------------------------------------------------------------------
| Rutas para administradores (requieren auth + rol admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'check.token.expiration', IsAdmin::class])->group(function () {
    // Gestión de usuarios
    Route::apiResource('users', UserController::class);

    // Gestión de proveedores
    Route::apiResource('providers', ProviderController::class);

    // Gestión completa de productos (excepto index y show públicos)
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);

    // Gestión de outlet (excepto index/show/update públicos o deshabilitados)
    Route::apiResource('outlet', OutletController::class)->except(['index', 'show', 'update']);
});

Route::apiResource('products', ProductController::class)->only(['index', 'show']); // pública

Route::apiResource('categories', CategoryController::class)->only(['index', 'show']); // pública

Route::apiResource('outlet', OutletController::class)->only(['index', 'show']); // pública

Route::apiResource('reviews', ReviewController::class)->only(['index', 'show']); // pública

Route::middleware('auth:sanctum')->group(function () {
    // Obtener usuario autenticado
    Route::get('/user', [AuthController::class, 'index']);

    Route::put('/user/profile', [UserController::class, 'updateOwnProfile']);

    Route::post('/user/avatar', [UserController::class, 'updateAvatar']);

    Route::apiResource('reviews', ReviewController::class)->except(['index', 'show']);
});

Route::middleware('auth:sanctum')->apiResource('orders', OrderController::class)->except(['update']);
Route::middleware('auth:sanctum')->patch('orders/{id}/status', [OrderController::class, 'updateStatus']);
