<?php

namespace App\Docs\Schemas;
/**
 * @OA\Schema(
 *     schema="ProductCreate",
 *     type="object",
 *     required={"name", "description", "price", "category_id", "provider_id"},
 *     @OA\Property(
 *         property="name",
 *         type="string",
 *         minLength=3,
 *         example="Sports T-shirt"
 *     ),
 *     @OA\Property(
 *         property="description",
 *         type="string",
 *         maxLength=255,
 *         example="High-performance technical t-shirt"
 *     ),
 *     @OA\Property(
 *         property="price",
 *         type="number",
 *         format="float",
 *         example=29.99
 *     ),
 *     @OA\Property(
 *         property="stock",
 *         type="integer",
 *         example=100
 *     ),
 *     @OA\Property(
 *         property="image",
 *         type="string",
 *         format="uri",
 *         example="https://example.com/product.jpg"
 *     ),
 *     @OA\Property(
 *         property="has_discount",
 *         type="boolean",
 *         enum={false},
 *         description="Must be false or equivalent (declined). The created product must NOT have a discount initially.",
 *         example=false
 *     ),
 *     @OA\Property(
 *         property="discount",
 *         type="number",
 *         description="Must be 0 if there is no discount.",
 *         example=0
 *     ),
 *     @OA\Property(
 *         property="category_id",
 *         type="integer",
 *         description="Related category ID (foreign key to Category)",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="provider_id",
 *         type="integer",
 *         description="Related provider ID (foreign key to Provider)",
 *         example=5
 *     )
 * )
 */


class ProductCreateSchema {}
