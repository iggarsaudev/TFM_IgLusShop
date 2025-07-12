<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Category;
use App\Models\Provider;


class OutletControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_fails_to_create_an_outlet_product_with_100_percent_discount(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $token = $admin->createToken('admin-token')->plainTextToken;
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        $payload = [
            'name' => 'Producto con 100% de descuento',
            'description' => 'Un producto que intenta tener 100% de descuento.',
            'price' => 100.00,
            'category_id' => $category->id,
            'provider_id' => $provider->id,
            'stock' => 10,
            'image' => 'https://example.com/image.jpg',
            'has_discount' => true,
            'discount' => 100,
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/outlet', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['discount']);
    }
    public function test_fails_to_create_an_outlet_product_with_discount_greater_than_100(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $token = $admin->createToken('admin-token')->plainTextToken;
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        $payload = [
            'name' => 'Producto con 100% de descuento',
            'description' => 'Un producto que intenta tener 100% de descuento.',
            'price' => 100.00,
            'category_id' => $category->id,
            'provider_id' => $provider->id,
            'stock' => 10,
            'image' => 'https://example.com/image.jpg',
            'has_discount' => true,
            'discount' => 200,
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/outlet', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['discount']);
    }
    public function test_fails_to_create_an_outlet_product_with_has_discount_false(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $token = $admin->createToken('admin-token')->plainTextToken;
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        $payload = [
            'name' => 'Producto sin descuento',
            'description' => 'Un producto que no tiene descuento',
            'price' => 100.00,
            'category_id' => $category->id,
            'provider_id' => $provider->id,
            'stock' => 10,
            'image' => 'https://example.com/image.jpg',
            'has_discount' => false,
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/outlet', $payload);

        $response->assertStatus(422);
    }
}
