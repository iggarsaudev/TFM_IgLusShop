<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class RegisterUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_successfully(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Nacho',
            'email' => 'nacho@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(201);
        $response->assertJson([
            'message' => 'Successfully registered user',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'nacho@example.com',
            'name' => 'Nacho',
        ]);
    }

    public function test_registration_fails_with_invalid_data(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => '',
            'email' => 'not-an-email',
            'password' => '123',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'email', 'password']);
    }


    public function test_user_cannot_register_with_existing_email(): void
    {
        // Creamos un usuario
        User::factory()->create([
            'name' => 'Nacho',
            'email' => 'nacho@example.com',
            'password' => 'password',
        ]);

        // Intentamos registrarnos con ese mismo email
        $response = $this->postJson('/api/register', [
            'name' => 'Otro Nacho',
            'email' => 'nacho@example.com',
            'password' => 'password123',
        ]);

        // Comprobamos que devuelve código 409
        $response->assertStatus(409);

        // Comprobamos el mensaje
        $response->assertJson([
            'error' => 'The email is already registered',
        ]);
    }
}
