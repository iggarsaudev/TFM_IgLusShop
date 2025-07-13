<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\ResourceNotFoundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProviderRequest;
use App\Http\Requests\UpdateProviderRequest;
use App\Models\Provider;

class ProviderController extends Controller
{
    /**
     * Returns a list of all providers registered in the database.
     *
     * Requires authentication and administrator permissions.
     *
     * This function retrieves all records from the Provider model and returns them in JSON format. Each provider includes a name and description.
     * 
     * @return \Illuminate\Http\JsonResponse Providers List 
     * 
     * @OA\Get( 
     *     path="/api/providers", 
     *     summary="Get all providers", 
     *     tags={"Providers"}, 
     *     security={{"bearerAuth": {}}},
     *     @OA\Response( 
     *         response=200, 
     *         description="Providers list", 
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Provider")
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
        return response()->json(Provider::all(), 200);
    }

    /**
     * Creates a new provider with the provided data.
     * 
     * Requires authentication and administrator permissions.
     * 
     * Validates required fields before storing the resource.
     * The "description" field is optional.
     * Returns the ID of the created provider and a confirmation message if the operation is successful.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse Provider ID created and confirmation message
     *
     * @OA\Post(
     *     path="/api/providers",
     *     summary="Create a new provider",
     *     tags={"Providers"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/ProviderCreateSchema")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Provider created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Provider created successfully"),
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
    public function store(StoreProviderRequest $request)
    {
        $provider = Provider::create([
            'name' => $request->name,
            'description' => $request->description
        ]);

        return response()->json([
            'message' => 'Provider created successfully',
            'id' => $provider->id,
        ], 201);
    }

    /** 
     * Returns data for a specific provider.
     * 
     * Requires authentication and administrator permissions.
     * 
     * Searches for the provider by its ID. If not found, returns an error.
     * 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse Provider details or error
     * 
     * @OA\Get( 
     *      path="/api/providers/{id}", 
     *      summary="Get a provider by ID", 
     *      tags={"Providers"}, 
     *      security={{"bearerAuth": {}}},
     *      @OA\Parameter( 
     *          name="id", 
     *          in="path", 
     *          required=true, 
     *          description="Provider ID", 
     *          @OA\Schema(type="integer") 
     *      ), 
     *      @OA\Response( 
     *          response=200, 
     *          description="Provider details", 
     *          @OA\JsonContent(ref="#/components/schemas/Provider") 
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
        $provider = Provider::find($id);

        if (!$provider) {
            return response()->json(['error' => 'Resource not found'], 404);
        }

        return response()->json($provider);
    }

    /** 
     * Updates an existing provider's data.
     * 
     * Requires authentication and administrator permissions.
     * 
     * Allows you to update one or more provider fields.
     * Returns the updated provider if everything is correct. 
     * 
     * @param \Illuminate\Http\Request $request 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse Updated provider or error message 
     * 
     * @OA\Put( 
     *      path="/api/providers/{id}", 
     *      summary="Update a provider", 
     *      tags={"Providers"}, 
     *      security={{"bearerAuth": {}}},
     *      @OA\Parameter( 
     *          name="id", 
     *          in="path", 
     *          required=true, 
     *          description="Provider ID to update", 
     *          @OA\Schema(type="integer") 
     *      ), @OA\RequestBody( 
     *          required=true, 
     *          @OA\JsonContent( 
     *              ref="#/components/schemas/ProviderUpdateSchema" 
     *          ) 
     *      ), 
     *      @OA\Response(
     *          response=200,
     *          description="Provider updated successfully",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Provider updated successfully"),
     *              @OA\Property(property="provider", ref="#/components/schemas/Provider")
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
    public function update(UpdateProviderRequest $request, $id)
    {
        $provider = Provider::find($id);

        if ($request->has('name')) $provider->name = $request->name;
        if ($request->has('description')) $provider->description = $request->description;

        $provider->save();

        return response()->json([
            'message' => 'Provider updated successfully.',
            'provider' => $provider,
        ], 200);
    }

    /** 
     * Deletes a provider by its ID.
     * 
     * Requires authentication and administrator permissions.
     * 
     * If the provider does not exist, a 404 error is returned.
     * If deleted successfully, a 204 code is returned.
     * 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse Result of the elimination 
     * 
     * @OA\Delete( 
     *      path="/api/providers/{id}", 
     *      summary="Delete a provider", 
     *      tags={"Providers"},
     *      security={{"bearerAuth": {}}}, 
     *      @OA\Parameter( 
     *          name="id", 
     *          in="path", 
     *          required=true, 
     *          description="ID of the provider to be deleted", 
     *          @OA\Schema(type="integer") 
     *      ), 
     *      @OA\Response( 
     *          response=200, 
     *          description="Provide successfully removed" 
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
    public function destroy(string $id)
    {
        $provider = Provider::find($id);

        if (!$provider) {
            throw new ResourceNotFoundException('Resource not found');
        }

        $provider->delete();

        return response()->json([
            'message' => 'Provider removed'
        ], 200);
    }
}
