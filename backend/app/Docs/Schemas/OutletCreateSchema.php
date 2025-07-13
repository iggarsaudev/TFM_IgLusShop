<?php

namespace App\Docs\Schemas;
/**
 * @OA\Schema(
 *     schema="OutletCreate",
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
 *         enum={true},
 *         description="Must be true or equivalent (accepted). The created product must have a discount",
 *         example=true
 *     ),
 *     @OA\Property(
 *         property="discount",
 *         type="number",
 *         description="Must be a value greater than 0 and less than or equal to 100.",
 *         example=15
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

class OutletCreateSchema {}
