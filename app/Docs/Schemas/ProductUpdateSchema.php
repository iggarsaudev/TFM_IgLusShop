<?php

namespace App\Docs\Schemas;

/**
 * @OA\Schema(
 *     schema="ProductUpdate",
 *     type="object",
 *     title="Actualización de Producto",
 *     description="Schema para actualizar un producto",
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
 *         example="confortable t-shirt for training"
 *     ),
 *     @OA\Property(
 *         property="price",
 *         type="number",
 *         format="float",
 *         example=49.99
 *     ),
 *     @OA\Property(
 *         property="stock",
 *         type="integer",
 *         example=150
 *     ),
 *     @OA\Property(
 *         property="image",
 *         type="string",
 *         format="uri",
 *         example="https://example.com/images/product.png"
 *     ),
 *     @OA\Property(
 *         property="has_discount",
 *         type="boolean",
 *         example=false
 *     ),
 *     @OA\Property(
 *         property="discount",
 *         type="number",
 *         example=0
 *     ),
 *     @OA\Property(
 *         property="category_id",
 *         type="integer",
 *         example=1,
 *         description="Related category ID (foreign key a Category)" 
 *     ),
 *     @OA\Property(
 *         property="provider_id",
 *         type="integer",
 *         example=2,
 *         description="Related provider ID (foreign key a Provider)"
 *     )
 * )
 */

class ProductUpdateSchema {}
