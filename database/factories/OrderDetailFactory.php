<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderDetail>
 */
class OrderDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = $this->faker->numberBetween(1, 5);
        $unit_price = $this->faker->randomFloat(2, 10, 100);

        return [
            'order_id' => rand(1, 10),
            'product_id' => rand(1, 20),
            'quantity' => $quantity,
            'unit_price' => $unit_price,
        ];
    }
}
