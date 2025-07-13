<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Category;


class CategoryController extends Controller
{
    /**
     * Returns a list of all categoires.
     * 
     * 
     * @return \Illuminate\Http\JsonResponse Order List 
     * @OA\Get(
     *     path="/api/categories",
     *     summary="Category List",
     *     tags={"Categories"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Response(
     *          response=200, 
     *          description="Order List", 
     *          @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Order"))
     *     ),
     * )
     */
    public function index()
    {
        return response()->json(Category::all(), 200);
    }
}
