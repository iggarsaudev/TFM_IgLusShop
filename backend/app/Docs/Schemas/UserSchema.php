<?php

namespace App\Docs\Schemas;

/** 
 * @OA\Schema( 
 *      schema="User", 
 *      type="object", 
 *      title="User", 
 *      required={"name", "email", "password"}, 
 *      @OA\Property(property="id", type="integer", example=1), 
 *      @OA\Property( 
 *          property="name", 
 *          type="string", 
 *          example="Ignacio" 
 *      ), 
 *      @OA\Property( 
 *          property="email", 
 *          type="string", 
 *          example="ejemplo@correo.com"
 *      ), 
 *      @OA\Property( 
 *          property="password", 
 *          type="string", 
 *          example="password" 
 *      ), 
 *      @OA\Property( 
 *          property="role", 
 *          type="string", 
 *          enum={ 
 *              "admin", 
 *              "user"
 *          }, 
 *          example="admin" 
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

class UserSchema {}
