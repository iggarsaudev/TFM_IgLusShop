<?php

namespace App\Docs\Schemas;

/** 
 * @OA\Schema( 
 *      schema="Product", 
 *      type="object", 
 *      title="Product", 
 *      required={"id","name", "description", "price","stock","image","has_discount","discount",
 *      "provider_id","category_id","created_at","updated_at"}, 
 *      @OA\Property(property="id", type="integer", example=1), 
 *      @OA\Property( 
 *          property="name", 
 *          type="string", 
 *          example="Sports T-shirt" 
 *      ), 
 *      @OA\Property( 
 *          property="description", 
 *          type="string", 
 *          example="High-performance technical t-shirt"
 *      ), 
 *      @OA\Property( 
 *          property="price", 
 *          type="number", 
 *          example=29.99 
 *      ), 
 *      @OA\Property( 
 *          property="stock", 
 *          type="integer", 
 *          example=2 
 *      ),
 *      @OA\Property( 
 *          property="image", 
 *          type="string", 
 *          format="uri",
 *          example="https://www.example.com/images/tshirt.jpg"
 *      ), 
 *      @OA\Property( 
 *          property="has_discount", 
 *          type="boolean", 
 *          example=false,
 *          default=0,
 *          description="Este campo debe ser siempre false. si se cambia a true el producto pasa al outlet"
 *      ), 
 *      @OA\Property( 
 *          property="discount", 
 *          type="number", 
 *          example=0,
 *          description="Si has_discount es falsy entonces discount debe ser 0"
 *      ), 
 *      @OA\Property( 
 *          property="provider_id", 
 *          type="integer", 
 *          example=1,
 *          description="Related provider ID (foreign key a Provider)"
 *      ), 
 *     @OA\Property( 
 *          property="category_id", 
 *          type="integer", 
 *          example=1,
 *          description="Related category ID (foreign key a Category)" 
 *      ), 
 *      @OA\Property( 
 *      property="created_at", 
 *      type="string", 
 *      format="date-time", 
 *      example="2025-04-05 21:45:59" 
 *      ), 
 *      @OA\Property( 
 *          property="updated_at", 
 *          type="string", 
 *          format="date-time", 
 *          example="2025-04-05 21:45:59" 
 *      ) 
 * ) 
 */

class ProductSchema {}
