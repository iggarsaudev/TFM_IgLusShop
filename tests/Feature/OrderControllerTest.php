<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Provider;
use App\Models\Order;
use App\Models\OrderDetail;




class OrderControllerTest extends TestCase
{
    public function test_user_can_create_order()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'provider_id'=>$provider->id,
            'stock' => 10]);

        $payload = [
            'items' => [
                ['product_id' => $product->id, 'quantity' => 3],
            ]
        ];
        $token = $user->createToken('api-token')->plainTextToken;
        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/orders', $payload)
            ->assertStatus(201)
            ->assertJsonFragment(['message' => 'Order created successfully.']);

        $this->assertDatabaseHas('orders', ['user_id' => $user->id]);
        $this->assertDatabaseHas('order_details', [
            'product_id' => $product->id,
            'quantity' => 3
        ]);
    }
        public function test_update_stock_after_create_order()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'provider_id'=>$provider->id,
            'stock' => 10]);

        $payload = [
            'items' => [
                ['product_id' => $product->id, 'quantity' => 3],
            ]
        ];
        $token = $user->createToken('api-token')->plainTextToken;
        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/orders', $payload);
        $this->assertEquals(7, $product->fresh()->stock); 
    }

    public function test_order_fails_if_product_does_not_exist()
    {
        $user = User::factory()->create();

        $payload = [
            'items' => [
                ['product_id' => 9999, 'quantity' => 2],
            ]
        ];
        $token = $user->createToken('api-token')->plainTextToken;
        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/orders', $payload)
            ->assertStatus(422);
    }

    public function test_order_fails_if_not_enough_stock()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'provider_id'=>$provider->id,
            'stock' => 1]);

        $payload = [
            'items' => [
                ['product_id' => $product->id, 'quantity' => 5],
            ]
        ];

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/orders', $payload)
            ->assertStatus(400)
            ->assertJsonFragment(['error' => 'Not enough stock for the product']);
    }
        public function test_user_can_cancel_order()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'provider_id'=>$provider->id,
            'stock' => 10]);

       
        $order = Order::factory()->create(['user_id' => $user->id, 'status' => 'pending']);
        OrderDetail::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 3,
            'unit_price' => $product->price
        ]);

        // Descontar stock manualmente para simular lo que hace store()
        $product->decrement('stock', 3);


        $token = $user->createToken('api-token')->plainTextToken;
        $this->withHeader('Authorization', 'Bearer ' . $token)
             ->patchJson("/api/orders/{$order->id}/status", ['status' => 'cancelled'])
            ->assertStatus(200);
    }
        public function test_update_stock_after_cancel_order()
    {
         $user = User::factory()->create();
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'provider_id'=>$provider->id,
            'stock' => 10]);

       
        $order = Order::factory()->create(['user_id' => $user->id, 'status' => 'pending']);
        OrderDetail::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 3,
            'unit_price' => $product->price
        ]);

        // Descontar stock manualmente para simular lo que hace store()
        $product->decrement('stock', 3);


        $token = $user->createToken('api-token')->plainTextToken;
        $this->withHeader('Authorization', 'Bearer ' . $token)
             ->patchJson("/api/orders/{$order->id}/status", ['status' => 'cancelled']);
        $this->assertEquals(10, $product->fresh()->stock); 
    }
}
