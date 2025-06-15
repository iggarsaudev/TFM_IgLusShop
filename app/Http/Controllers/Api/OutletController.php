<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\OutletRequest;

class OutletController extends Controller
{
    /**
     * Returns a list of all the products with discount.
     * 
     * This is a public endpoint .
     * 
     * This function retrieves all products with a discount from the
     * Product model and returns them in JSON format. Each product includes
     * id, name, description, price, stock, image, has_discount, discount, provider_id, category_id, created_at, and updated_at.
     * id, name, description, price, stock, image,has_discount,discount,provider_id,category_id,created_at,updated_at.
     * 
     * @return \Illuminate\Http\JsonResponse List of products with discount
     * 
     * @OA\Get( 
     *     path="/api/outlet", 
     *     summary="Get all products with a discount", 
     *     tags={"Outlet"}, 
     *     @OA\Response( 
     *         response=200, 
     *         description="List of products with discount (public endpoint, does not require authentication).", 
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Product")
     *         ) 
     *     ),
     * )
     */
    public function index()
    {
        return Product::where('has_discount', true)->get();
    }

    /**
     * Creates a new product from outlet.
     *
     * Requires authentication and administrator permissions.
     *
     * When creating a new product, the following fields are required:
     *
     * - `name`: The name of the product. Must be a string with a minimum of 3 characters.
     * - `description`: A detailed description of the product. Must be a string with a maximum of 255 characters.
     * - `price`: The price of the product. Must be a decimal number with up to two decimal places.
     * - `category_id`: ID of the category the product belongs to. Must be an integer and must exist in the database.
     * - `provider_id`: ID of the provider associated with the product. Must be an integer and must exist in the database.
     *
     * The following fields are optional, but if included, must meet the specified validations:
     *
     * - `stock`: An integer indicating the available quantity of the product in stock.
     * - `image`: A valid URL pointing to the product's image.
     * - `has_discount`: A boolean field indicating whether the product has a discount. This field must always be true for outlet products.
     *    To create a product without a discount, use the appropriate products endpoint.
     * - `discount`: The discount applied to the product. If `has_discount` is true, this value must be greater than 0 and less than 100.
     *
     * Validation includes type constraints and specific value rules. If any field does not comply with the rules, an error will be returned.
     *
     *
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse Created product id and  y confirmation message
     *
     * @OA\Post(
     *     path="/api/outlet",
     *     summary="Creates a new product from outlet",
     *     tags={"Outlet"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/OutletCreate")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Product successfully created",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Product successfully created."),
     *             @OA\Property(property="id", type="integer", example=21)
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
    public function store(OutletRequest $request)
    {

        $product = Product::create($request->all());
        return response()->json([
            'message' => "Product successfully created.",
            'id' => $product->id
        ], 201);
    }
    /** 
     * Returns the data of a specific outlet product.
     * 
     * This is a public endpoint.
     * 
     * It searches for the product by its ID and checks if it belongs to the outlet.
     * If not found, it returns an error.
     * 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse Product details or error
     * 
     * @OA\Get( 
     *      path="/api/outlet/{id}", 
     *      summary="Get an outlet product by ID", 
     *      tags={"Outlet"}, 
     *      @OA\Parameter( 
     *          name="id", 
     *          in="path", 
     *          required=true, 
     *          description="Product ID", 
     *          @OA\Schema(type="integer") 
     *      ), 
     *      @OA\Response( 
     *          response=200, 
     *          description="Product details", 
     *          @OA\JsonContent(ref="#/components/schemas/Product") 
     *      ),
     *      @OA\Response( 
     *          response=404, 
     *          description="Product not found or not belonging to the outlet", 
     *          @OA\JsonContent( 
     *              ref="#/components/schemas/NotFoundError" 
     *          ) 
     *      ) 
     * ) 
     */
    public function show(string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(
                ['message' => 'Product not found'],
                404
            );
        }
        if (!($product->has_discount)) {
            return response()->json(
                ['message' => 'This product is not from the outlet.'],
                404
            );
        }
        return response()->json($product, 200);
    }

    /** 
     * Deletes a product from the outlet by its ID.
     * 
     * Requires authentication and administrator permissions.
     * 
     * If the product does not exist, it returns a 404 error.
     * If successfully deleted, it returns a 200 status code.
     * 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse Deletion result
     * 
     * @OA\Delete( 
     *      path="/api/outlet/{id}", 
     *      summary="Delete an outlet product", 
     *      tags={"Outlet"},
     *      security={{"bearerAuth": {}}}, 
     *      @OA\Parameter( 
     *          name="id", 
     *          in="path", 
     *          required=true, 
     *          description="ID of the product to delete", 
     *          @OA\Schema(type="integer") 
     *      ), 
     *      @OA\Response( 
     *          response=200, 
     *          description="Product successfully deleted" 
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
     *          description="Product not found", 
     *          @OA\JsonContent( ref="#/components/schemas/NotFoundError" )
     *      ), 
     * ) 
     */
    public function destroy(string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(
                ['message' => 'Product not found'],
                404
            );
        }
        if (!($product->has_discount)) {
            // Este endpoint solo debe eliminar productos del oultet
            return response()->json(
                ['message' => 'This product is not from the outlet.'],
                404
            );
        }
        $product->delete();
        return response()->json(
            ['message' => 'Product successfully deleted'],
            200
        );
    }
}
