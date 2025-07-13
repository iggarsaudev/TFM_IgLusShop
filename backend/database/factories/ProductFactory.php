<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 5, 200),
            'stock' => $this->faker->numberBetween(0, 100),
            'image' => $this->getDummyImage(),
            'has_discount' =>$hasDiscount = fake()->boolean(),
            'discount' => $hasDiscount ? fake()->randomFloat(2, 5, 90) : 0,
            'category_id' => rand(1, 5),
            'provider_id' => rand(1, 5), 
        ];
    }
    private function getDummyImage(): string
    {
        $response = \Illuminate\Support\Facades\Http::get('https://dummyjson.com/products');

        if ($response->successful()) {
            $products = $response->json()['products'];
            $random = $products[array_rand($products)];
            return $random['images'][0] ?? 'https://via.placeholder.com/300';
        }

        // Fallback si falla la petición
        return 'https://via.placeholder.com/300';
    }
}
