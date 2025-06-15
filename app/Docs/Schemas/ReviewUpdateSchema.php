<?php

namespace App\Docs\Schemas;

/** 
 * @OA\Schema( 
 *      schema="ReviewUpdate", 
 *      type="object", 
 *      title="Review", 
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
 * ) 
 */

class ReviewUpdateSchema {}