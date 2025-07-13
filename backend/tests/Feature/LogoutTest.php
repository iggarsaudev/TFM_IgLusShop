<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class LogoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_logout_with_valid_token(): void
    {
        // Creamos un usuario
        $user = User::factory()->create();

        // Creamos un token para el usuario
        $token = $user->createToken('test-token')->plainTextToken;

        // Hacemos la petición logout
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');

        // Comprobamos status 200
        $response->assertStatus(200);

        // Comprobamos mensaje correcto
        $response->assertJson(['message' => 'Successfully logged out']);
    }
}
