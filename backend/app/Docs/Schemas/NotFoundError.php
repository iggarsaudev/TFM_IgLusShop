<?php

namespace App\Docs\Schemas;

/** 
 * @OA\Schema( 
 *      schema="NotFoundError", 
 *      type="object", 
 *      title="Resource not found", 
 *      @OA\Property( 
 *          property="message", 
 *          type="string", 
 *          example="Resource not found" 
 *      ) 
 * ) 
 */

class NotFoundError {}
