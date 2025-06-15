<?php

namespace App\Docs\Schemas;

/**
 * @OA\Schema(
 *     schema="UpdateOrderStatusRequest",
 *     type="object",
 *     title="Update Order Status Request",
 *     required={"status"},
 *     @OA\Property(
 *         property="status",
 *         type="string",
 *         enum={"pending", "sent", "cancelled", "delivered"},
 *         example="sent"
 *     )
 * )
 */
class UpdateOrderStatusRequestSchema {}
