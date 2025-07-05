<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\IsAdmin;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProviderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OutletController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\CategoryController;

/*
|--------------------------------------------------------------------------
| Rutas públicas (sin autenticación)
|--------------------------------------------------------------------------
*/

// Autenticación
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Recursos públicos
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::apiResource('outlet', OutletController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('reviews', ReviewController::class)->only(['index', 'show']);

// Reseñas por producto
Route::get('/product/{productId}/reviews', [ReviewController::class, 'getByProductId']);

/*
|--------------------------------------------------------------------------
| Rutas protegidas (requieren autenticación)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'check.token.expiration'])->group(function () {
    // Logout y renovación de token
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/renew-token', [AuthController::class, 'renewToken']);

    // Perfil de usuario
    Route::get('/user', [AuthController::class, 'index']);
    Route::put('/user/profile', [UserController::class, 'updateOwnProfile']);
    Route::post('/user/avatar', [UserController::class, 'updateAvatar']);

    // Reseñas (crear, actualizar, eliminar)
    Route::apiResource('reviews', ReviewController::class)->except(['index', 'show']);

    // Pedidos del usuario
    Route::apiResource('orders', OrderController::class)->except(['update']);

    // Ruta adicional para actualizar estado del pedido (opcional)
    Route::patch('orders/{id}/status', [OrderController::class, 'updateStatus']);
});

/*
|--------------------------------------------------------------------------
| Rutas de administrador (auth + rol admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'check.token.expiration', IsAdmin::class])->group(function () {
    // Gestión de usuarios
    Route::apiResource('users', UserController::class);

    // Gestión de proveedores
    Route::apiResource('providers', ProviderController::class);

    // Gestión completa de productos (excepto index/show públicos)
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);

    // Actualización de imagen del producto
    Route::post('/products/{id}/image', [ProductController::class, 'updateImage']);

    // Devuelve todos los productos, con y sin outlet
    Route::get('/products/full/{id}', [ProductController::class, 'getFullProduct']);

    // Gestión de outlet (excepto index/show/update)
    Route::apiResource('outlet', OutletController::class)->except(['index', 'show', 'update']);
});
