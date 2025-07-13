<?php

namespace App\Docs\Schemas;

/**
 * @OA\Schema(
 *     schema="OrderDetails",
 *     type="object",
 *     title="OrderDetails",
 *     required={"order_id", "product_id", "quantity", "unit_price"},
 *     @OA\Property(property="id", type="integer", example=10),
 *     @OA\Property(
 *          property="order_id", 
 *          type="integer", 
 *          example=1
 *     ),
 *     @OA\Property(
 *          property="product_id", 
 *          type="integer", 
 *          example=2
 *     ),
 *     @OA\Property(
 *          property="quantity", 
 *          type="integer", 
 *          example=3
 *     ),
 *     @OA\Property(
 *          property="unit_price", 
 *          type="number", 
 *          format="float", 
 *          example=49.99
 *     ),
 *     @OA\Property(
 *          property="created_at", 
 *          type="string", 
 *          format="date-time", 
 *          example="2025-04-21T10:30:00"
 *     ),
 *     @OA\Property(
 *          property="updated_at", 
 *          type="string", 
 *          format="date-time", 
 *          example="2025-04-21T10:30:00"
 *     )
 * )
 */
class OrderDetailsSchema {}
