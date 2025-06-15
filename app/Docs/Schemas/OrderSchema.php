<?php

namespace App\Docs\Schemas;

/**
 * @OA\Schema(
 *     schema="Order",
 *     type="object",
 *     title="Order",
 *     required={"user_id", "status", "total"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(
 *          property="user_id", 
 *          type="integer", 
 *          example=3
 *     ),
 *     @OA\Property(
 *          property="date", 
 *          type="string", 
 *          format="date-time", 
 *          example="2025-04-21T10:30:00"
 *     ),
 *     @OA\Property(
 *          property="status", 
 *          type="string", 
 *          enum={"pending", "sent", "cancelled", "delivered"}, example="pending"
 *     ),
 *     @OA\Property(
 *          property="total", 
 *          type="number", 
 *          format="float", 
 *          example=199.99
 *     ),
 *     @OA\Property(
 *          property="created_at", 
 *          type="string", 
 *          format="date-time", example="2025-04-21T10:30:00"
 *     ),
 *     @OA\Property(
 *          property="updated_at", 
 *          type="string", 
 *          format="date-time", 
 *          example="2025-04-21T10:30:00"
 *     ),
 *     @OA\Property(
 *         property="detalles",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/OrderDetails")
 *     )
 * )
 */
class OrderSchema {}
