<?php

namespace Database\Seeders;

use App\Models\Review;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reviews = [
            [
                'user_id' => 1,
                'product_id' => 1,
                'comment' => 'Muy buen producto, lo recomiendo.',
                'rating' => 5,
                'created_at' => '2025-04-07 18:30:00',
                'updated_at' => '2025-04-07 18:30:00',

            ],
            [
                'user_id' => 2,
                'product_id' => 1,
                'comment' => 'Calidad aceptable por el precio.',
                'rating' => 4,
                'created_at' => '2025-04-07 18:30:00',
                'updated_at' => '2025-04-07 18:30:00',

            ],
            [
                'user_id' => 3,
                'product_id' => 2,
                'comment' => 'No era lo que esperaba.',
                'rating' => 2,
                'created_at' => '2025-04-05 18:30:00',
                'updated_at' => '2025-04-05 18:30:00',

            ]
        ];

        foreach ($reviews as $review) {
            Review::create([
                'user_id' => $review['user_id'],
                'product_id' => $review['product_id'],
                'comment' => $review['comment'],
                'rating' => $review['rating'],
                'created_at' => $review['created_at'],
                'updated_at' => $review['updated_at'],

            ]);
        }
    }
}
