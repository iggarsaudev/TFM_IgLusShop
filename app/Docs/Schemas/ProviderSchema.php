<?php

namespace App\Docs\Schemas;

/** 
 * @OA\Schema( 
 *      schema="Provider", 
 *      type="object", 
 *      title="Provider", 
 *      required={"name"}, 
 *      @OA\Property(property="id", type="integer", example=1), 
 *      @OA\Property( 
 *          property="name", 
 *          type="string", 
 *          example="Nombre Proveedor" 
 *      ), 
 *      @OA\Property( 
 *          property="description", 
 *          type="string", 
 *          example="Descripción del nuevo proveedor"
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

class ProviderSchema {}
