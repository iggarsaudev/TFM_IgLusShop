<?php

namespace App\Docs\Schemas;

/**
 * @OA\Schema(
 *     schema="CreateOrderRequest",
 *     type="object",
 *     title="Create Order Request",
 *     required={"items"},
 *     @OA\Property(
 *         property="items",
 *         type="array",
 *         @OA\Items(
 *             type="object",
 *             required={"product_id", "quantity"},
 *             @OA\Property(
 *                  property="product_id", 
 *                  type="integer", 
 *                  example=2
 *             ),
 *             @OA\Property(
 *                  property="quantity", 
 *                  type="integer", 
 *                  example=1
 *             )
 *         )
 *     )
 * )
 */
class CreateOrderRequestSchema {}
