<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use App\Http\Requests\ReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Exceptions\ResourceNotFoundException;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Returns a list of all reviews in the database.
     * 
     * This function fetches all records from the Review model and 
     * returns them in JSON format.
     * 
     * @return \Illuminate\Http\JsonResponse List of reviews
     * 
     * @OA\Get( 
     *     path="/api/reviews", 
     *     summary="Get all reviews", 
     *     tags={"Reviews"}, 
     *     @OA\Response( 
     *         response=200, 
     *         description="List of reviews", 
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Review")
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
        return response()->json(Review::all(), 200);
    }

    /**
     * Creates a new review with the provided data.
     * 
     * Requires authentication.
     * 
     * Validates the required fields before storing the resource.
     * The "comment" field is optional.
     * Returns the ID of the created review and a confirmation message if successful.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse ID of the created review and confirmation message
     *
     * @OA\Post(
     *     path="/api/reviews",
     *     summary="Create a new review",
     *     tags={"Reviews"},
     *     security={{"bearerAuth": {}}}, 
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/ReviewCreate")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Review successfully created",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Review successfully created."),
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
    public function store(ReviewRequest $request)
    {
        $user_id=Auth::id();
        $review = Review::create([
            'user_id' => $user_id,
            'product_id' => $request->product_id,
            'comment'=> $request->comment,
            'rating'=> $request->rating
        ]);

        return response()->json([
            'message' => 'Review successfully created',
            'id' => $review->id,
        ], 201);
    }

    /**
     * Returns the details of a specific review.
     * 
     * Looks up the review by its ID. If not found, returns an error.
     * 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse Review details or error
     * 
     * @OA\Get( 
     *      path="/api/reviews/{id}", 
     *      summary="Get a review by its ID", 
     *      tags={"Reviews"}, 
     *      @OA\Parameter( 
     *          name="id", 
     *          in="path", 
     *          required=true, 
     *          description="Review ID", 
     *          @OA\Schema(type="integer") 
     *      ), 
     *      @OA\Response( 
     *          response=200, 
     *          description="Review details", 
     *          @OA\JsonContent(ref="#/components/schemas/Review") 
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
     *      ) 
     * ) 
     */
    public function show(string $id)
    {
        $review = Review::find($id);

        if (!$review) {
            throw new ResourceNotFoundException();
        }

        return response()->json($review);
    }

    /**
     * Updates the data of an existing review.
     * 
     * Requires authentication.
     * The review can only be updated if it was created by the authenticated user.
     * Allows updating one or more fields of a review.
     * Returns the updated review if successful.
     * 
     * @param \Illuminate\Http\Request $request 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse Updated review or error
     * 
     * @OA\Put( 
     *      path="/api/reviews/{id}", 
     *      summary="Update a review", 
     *      tags={"Reviews"}, 
     *      security={{"bearerAuth": {}}}, 
     *      @OA\Parameter( 
     *          name="id", 
     *          in="path", 
     *          required=true, 
     *          description="ID of the review to update", 
     *          @OA\Schema(type="integer") 
     *      ), 
     *      @OA\RequestBody( 
     *          required=true, 
     *          @OA\JsonContent( 
     *              ref="#/components/schemas/ReviewUpdate" 
     *          ) 
     *      ), 
     *      @OA\Response(
     *          response=200,
     *          description="Review successfully updated",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Review successfully updated"),
     *              @OA\Property(property="review", ref="#/components/schemas/Review")
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
    public function update(UpdateReviewRequest $request, $id)
    {
        $review = Review::find($id);
        if (!$review) {
            throw new ResourceNotFoundException();
            }
            $user_id=Auth::id();

        if ($user_id!==$review->user_id) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }
      
        $review->update($request->all());

        return response()->json([
            'message' => 'Review successfully updated',
            'review' => $review,
        ], 200);
    }

    /**
     * Deletes a review by its ID.
     * 
     * Requires authentication.
     * 
     * The review can only be deleted if it was created by the authenticated user.
     * 
     * If the review does not exist, returns a 404 error.
     * If successfully deleted, returns a 200 status code.
     * 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse Deletion result
     * 
     * @OA\Delete( 
     *      path="/api/reviews/{id}", 
     *      summary="Delete a review", 
     *      tags={"Reviews"},
     *      security={{"bearerAuth": {}}}, 
     *      @OA\Parameter( 
     *          name="id", 
     *          in="path", 
     *          required=true, 
     *          description="ID of the review to delete", 
     *          @OA\Schema(type="integer") 
     *      ), 
     *      @OA\Response( 
     *          response=204, 
     *          description="Review deleted" 
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
     *          @OA\JsonContent(ref="#/components/schemas/NotFoundError")
     *      ) 
     * ) 
     */
    public function destroy(string $id)
    {
        $review = Review::find($id);
        $user_id=Auth::id();

        if (!$review) {
            throw new ResourceNotFoundException();
        }
        
        if ($user_id!==$review->user_id) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }
        $review->delete();

        return response()->json([
            'message' => 'Review deleted.'
        ], 200);
    }
}
