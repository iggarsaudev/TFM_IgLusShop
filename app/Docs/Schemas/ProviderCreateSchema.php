<?php

namespace App\Docs\Schemas;

/** 
 * @OA\Schema( 
 *      schema="ProviderCreateSchema", 
 *      type="object",
 *      required={"name"}, 
 *      @OA\Property( 
 *          property="name", 
 *          type="string", 
 *          example="Nombre Proveedor" 
 *      ), 
 *      @OA\Property( 
 *          property="description", 
 *          type="string", 
 *          example="Descripción del nuevo proveedor"
 *      )
 * ) 
 */

class ProviderCreateSchema {}
