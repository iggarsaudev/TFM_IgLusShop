<?php

namespace Tests\Feature\Middleware;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Route;

class IsAdminMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Route::middleware(['auth:sanctum', \App\Http\Middleware\IsAdmin::class])
            ->get('/test-admin-only', function () {
                return response()->json(['message' => 'Access granted']);
            });
    }

    public function test_user_with_user_token_cannot_access_admin_route(): void
    {
        $user = User::factory()->create();

        // Creamos token personal
        $token = $user->createToken('user-token')->plainTextToken;

        // Usamos el token
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/test-admin-only');

        $response->assertStatus(403)
            ->assertJson(['message' => 'Unauthorized']);
    }

    public function test_user_with_admin_token_can_access_admin_route(): void
    {
        $user = User::factory()->create();

        // Creamos token personal
        $token = $user->createToken('admin-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/test-admin-only');

        $response->assertOk()
            ->assertJson(['message' => 'Access granted']);
    }

    public function test_unauthenticated_user_cannot_access_admin_route(): void
    {
        $response = $this->getJson('/test-admin-only');

        $response->assertStatus(401)
            ->assertJson(['message' => 'Unauthenticated.']);
    }
}
