<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\ResourceNotFoundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Returns a list of all users registered in the database.
     * 
     * Requires authentication and administrator permissions.
     * 
     * This function retrieves all records from the User model and returns them in JSON format. Each user includes a name, email, password, and role.
     * 
     * @return \Illuminate\Http\JsonResponse User List 
     * 
     * @OA\Get( 
     *     path="/api/users", 
     *     summary="Get all users", 
     *     tags={"Users"}, 
     *     security={{"bearerAuth": {}}},
     *     @OA\Response( 
     *         response=200, 
     *         description="User List", 
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/User")
     *         ) 
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized"
     *     ) 
     * )
     */
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    /**
     * Creates a new user with the provided data.
     * 
     * Requires authentication and administrator permissions.
     * 
     * Validates required fields before storing the resource.
     * The "role" field is optional; if not specified, it will be "user".
     * Returns the created user ID and a confirmation message if the operation is successful.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse Created user ID and confirmation message
     *
     * @OA\Post(
     *     path="/api/users",
     *     summary="Create a new user",
     *     tags={"Users"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UserCreateSchema")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Successfully created user",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Successfully created user."),
     *             @OA\Property(property="id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation errors",
     *         @OA\JsonContent(ref="#/components/schemas/ValidationError")
     *     )
     * )
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'user', // Asigna el rol enviado o 'user' por defecto
        ]);

        return response()->json([
            'message' => 'Successfully created user.',
            'id' => $user->id,
        ], 201);
    }

    /** 
     * Returns data for a specific user.
     * 
     * Requires authentication and administrator permissions.
     * 
     * Searches for the user by ID. If not found, returns an error.
     * 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse User details or error
     * 
     * @OA\Get( 
     *      path="/api/users/{id}", 
     *      summary="Get a user by ID", 
     *      tags={"Users"}, 
     *      security={{"bearerAuth": {}}},
     *      @OA\Parameter( 
     *          name="id", 
     *          in="path", 
     *          required=true, 
     *          description="User ID", 
     *          @OA\Schema(type="integer") 
     *      ), 
     *      @OA\Response( 
     *          response=200, 
     *          description="User details", 
     *          @OA\JsonContent(ref="#/components/schemas/User") 
     *      ),
     *      @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized"
     *     ),
     *      @OA\Response( 
     *          response=404, 
     *          description="Resource not found", 
     *          @OA\JsonContent( 
     *              ref="#/components/schemas/NotFoundError" 
     *          ) 
     *      ) 
     * ) 
     */
    public function show(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Resource not found'], 404);
        }

        return response()->json($user);
    }

    /** 
     * Updates an existing user's data.
     * 
     * Requires authentication and administrator permissions.
     * 
     * Allows you to update one or more user fields.
     * Returns the updated user if everything is correct. 
     * 
     * @param \Illuminate\Http\Request $request 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse User updated or error message 
     * 
     * @OA\Put( 
     *      path="/api/users/{id}", 
     *      summary="Update a user", 
     *      tags={"Users"}, 
     *      security={{"bearerAuth": {}}},
     *      @OA\Parameter( 
     *          name="id", 
     *          in="path", 
     *          required=true, 
     *          description="User ID to update", 
     *          @OA\Schema(type="integer") 
     *      ), @OA\RequestBody( 
     *          required=true, 
     *          @OA\JsonContent( 
     *              ref="#/components/schemas/UserUpdateSchema" 
     *          ) 
     *      ), 
     *      @OA\Response(
     *          response=200,
     *          description="Successfully updated user",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Successfully updated user"),
     *              @OA\Property(property="user", ref="#/components/schemas/User")
     *          )
     *      ), 
     *      @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized"
     *     ), 
     *     @OA\Response( 
     *          response=404, 
     *          description="Resource not found", 
     *          @OA\JsonContent( 
     *              ref="#/components/schemas/NotFoundError" 
     *          ) 
     *      ), 
     *      @OA\Response( 
     *          response=422, 
     *          description="Validation errors", 
     *          @OA\JsonContent( 
     *              ref="#/components/schemas/ValidationError" 
     *          ) 
     *      ) 
     * ) 
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::find($id);

        if ($request->has('name')) $user->name = $request->name;
        if ($request->has('email')) $user->email = $request->email;
        if ($request->has('password')) $user->password = Hash::make($request->password);
        if ($request->has('role') && Auth::user()->role === 'admin') {
            $user->role = $request->role;
        }

        $user->save();

        return response()->json([
            'message' => 'Successfully updated user.',
            'user' => $user,
        ], 200);
    }

    /** 
     * Deletes a user by their ID.
     * 
     * Requires authentication and administrator permissions.
     * 
     * If the user doesn't exist, returns a 404 error.
     * If deleted successfully, returns a 204 code.
     * 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse Result of the elimination
     * 
     * @OA\Delete( 
     *      path="/api/users/{id}", 
     *      summary="Delete a user", 
     *      tags={"Users"},
     *      security={{"bearerAuth": {}}}, 
     *      @OA\Parameter( 
     *          name="id", 
     *          in="path", 
     *          required=true, 
     *          description="ID of the user to be deleted", 
     *          @OA\Schema(type="integer") 
     *      ), 
     *      @OA\Response( 
     *          response=200, 
     *          description="Successfully deleted user" 
     *      ), 
     *      @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *      ),
     *      @OA\Response(
     *         response=403,
     *         description="Unauthorized"
     *      ),
     *      @OA\Response( 
     *          response=404, 
     *          description="Resource not found", 
     *          @OA\JsonContent( ref="#/components/schemas/NotFoundError" )
     *      ), 
     * ) 
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            throw new ResourceNotFoundException('Resource not found');
        }

        $user->delete();

        return response()->json([
            'message' => 'Successfully deleted user'
        ], 200);
    }
}
