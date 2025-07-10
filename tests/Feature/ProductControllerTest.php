<?php


namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Category;
use App\Models\Provider;


class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_lists_products_without_discount()
    {
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        Product::factory()->create([
            'has_discount' => false,
            'category_id' => $category->id,
            'provider_id'=>$provider->id]);
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        Product::factory()->create([
            'has_discount' => true,
            'category_id' => $category->id,
            'provider_id'=>$provider->id]);

        $response = $this->getJson('/api/products');

        $response->assertOk();
        $this->assertCount(1, $response->json());
        $this->assertFalse($response->json()[0]['has_discount']);
    }
    public function test_returns_422_with_has_discount_false_and_discount_greater_than_0():void {
        $user = User::factory()->create(['role' => 'admin']);
        $token = $user->createToken('admin-token')->plainTextToken;
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        $payload = [
            'name' => 'Test Product',
            'description' => 'Short desc',
            'price' => 49.99,
            'discount' => 4,
            'has_discount' => false,
            'category_id' => $category->id,
            'provider_id' => $provider->id,
        ];

        $this->withHeader('Authorization', 'Bearer ' . $token);
        $response = $this->postJson('/api/products', $payload);

        $response->assertStatus(422);
    }
    public function test_sets_discount_to_zero_when_has_discount_is_false():void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $category = Category::factory()->create();
        $provider = Provider::factory()->create();

        $payload = [
            'name' => 'Producto sin descuento',
            'description' => 'No debería tener descuento',
            'price' => 50.00,
            'stock' => 5,
            'image' => 'https://example.com/image.jpg',
            'category_id' => $category->id,
            'provider_id' => $provider->id,
            'has_discount' => false,
        ];

        $token = $admin->createToken('admin-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/products', $payload);

        $response->assertStatus(201);

        $productId = $response->json('id');
        $product = Product::find($productId);

        $this->assertEquals(0, $product->discount);
    }
    public function test_creates_a_product_with_invalid_data()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $token = $user->createToken('admin-token')->plainTextToken;
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        $payload = [
            'name' => 'Te',
            'description' => 'Short desc',
            'price' => "hello",
            'has_discount' => false,
            'category_id' => $category->id,
            'provider_id' => $provider->id,
        ];

        $this->withHeader('Authorization', 'Bearer ' . $token);
        $response = $this->postJson('/api/products', $payload);

        $response->assertStatus(422);
    }

    public function test_returns_unauthorized_when_creating_without_auth()
    {
        $response = $this->postJson('/api/products', []);
        $response->assertStatus(401);
    }

    public function test_shows_a_product_if_not_outlet()
    {
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        $product = Product::factory()->create([
            'has_discount' => false,
            'category_id' => $category->id,
            'provider_id'=>$provider->id]);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertOk()
                 ->assertJsonFragment(['id' => $product->id]);
    }

    public function test_returns_404_for_outlet_product_on_show()
    {
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        $product = Product::factory()->create([
            'discount'=>33,
            'has_discount' => true,
            'category_id' => $category->id,
            'provider_id'=>$provider->id]);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertStatus(404);
    }

    public function test_updates_a_product()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $token = $user->createToken('admin-token')->plainTextToken;

        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        $product = Product::factory()->create([
            'has_discount' => false,
            'category_id' => $category->id,
            'provider_id'=>$provider->id]);


        $response = $this->withHeader('Authorization', 'Bearer ' . $token)->
        putJson("/api/products/{$product->id}", [
            'name' => 'Updated Name'
        ]);

        $response->assertOk()
                 ->assertJsonFragment(['message' => 'Product successfully updated']);
    }

    public function test_creates_a_product_with_valid_data_deletes_a_non_outlet_product()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $token = $user->createToken('admin-token')->plainTextToken;
        $category = Category::factory()->create();
        $provider = Provider::factory()->create();
        $product = Product::factory()->create([
            'has_discount' => false,
            'category_id' => $category->id,
            'provider_id'=>$provider->id]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->deleteJson("/api/products/{$product->id}");

        $response->assertOk()
                 ->assertJsonFragment(['message' => 'Product successfully deleted']);
    }
}