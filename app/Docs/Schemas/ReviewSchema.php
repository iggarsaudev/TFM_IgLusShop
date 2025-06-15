<?php

namespace App\Docs\Schemas;

/** 
 * @OA\Schema( 
 *      schema="Review", 
 *      type="object", 
 *      title="Review", 
 *      required={"id","user_id","product_id","comment","rating"}, 
 *      @OA\Property(property="id", type="integer", example=1), 
 *      @OA\Property( 
 *          property="user_id", 
 *          type="integer", 
 *          example=1,
 *          description="ID of the user who created the review (foreign key to users)" 
 *      ), 
 *      @OA\Property( 
 *          property="product_id", 
 *          type="integer", 
 *          example=1,
 *          description="ID of the product the review refers to (foreign key to products)" 
 *      ),
 *      @OA\Property( 
 *          property="comment", 
 *          type="string", 
 *          example="The product is of good quality",
 *      ), 
 *      @OA\Property( 
 *          property="rating", 
 *          type="integer", 
 *          example=5,
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

class ReviewSchema {}