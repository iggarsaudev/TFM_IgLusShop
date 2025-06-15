<?php

namespace App\Docs\Schemas;

/** 
 * @OA\Schema( 
 *      schema="UserUpdateSchema", 
 *      type="object",
 *      required={"name", "email", "password"}, 
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
 *      )
 * ) 
 */

class UserUpdateSchema {}
