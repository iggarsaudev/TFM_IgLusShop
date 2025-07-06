<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Requests\ProductRequest;
use App\Http\Requests\ProductUpdateRequest;

class ProductController extends Controller
{
    /**
     * Returns a list of all products without a discount.
     * 
     * This endpoint is public.
     * 
     * This function retrieves all products without a discount from the
     * Product model and returns them in JSON format. Each product includes
     * id, name, description, price, stock, image, has_discount, discount, provider_id, category_id, created_at, and updated_at.
     * 
     * @return \Illuminate\Http\JsonResponse List of products without discount
     * 
     * @OA\Get( 
     *     path="/api/products", 
     *     summary="Get all products without discount", 
     *     tags={"Products"}, 
     *     @OA\Response( 
     *         response=200, 
     *         description="List of products without discount (public endpoint, does not require authentication)", 
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Product")
     *         ) 
     *     ),
     * )
     */
    public function index()
    {
        return Product::where('has_discount', false)->get();
    }

    /**
     * Creates a new product with the provided data.
     * 
     * Requires authentication and administrator permissions.
     * 
     * When creating a new product, the following fields are required:
     * 
     * - `name`: The name of the product. Must be a string with a minimum of 3 characters.
     * - `description`: A detailed description of the product. Must be a string with a maximum of 255 characters.
     * - `price`: The price of the product. Must be a decimal number with up to two decimal places.
     * - `category_id`: The ID of the category the product belongs to. Must be an integer and must exist in the database.
     * - `provider_id`: The ID of the provider associated with the product. Must be an integer and must exist in the database.
     * 
     * The following fields are optional, but if included, must meet the specified validations:
     * 
     * - `stock`: An integer indicating the available quantity of the product in stock.
     * - `image`: A valid URL pointing to the product's image.
     * - `has_discount`: A boolean field indicating whether the product has a discount. This field must always be false for standard products and true for outlet products.
     * - `discount`: The discount applied to the product. If `has_discount` is false, this value must be 0.
     * 
     * Validation includes type constraints and specific value rules. If any field does not comply with the rules, an error will be returned.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse ID of the created product and confirmation message
     *
     * @OA\Post(
     *     path="/api/products",
     *     summary="Create a new product",
     *     tags={"Products"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/ProductCreate")
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
    public function store(ProductRequest $request)
    {

        $product = Product::create($request->all());
        return response()->json([
            'message' => "Product successfully created.",
            'id' => $product->id
        ], 201);
    }

    /** 
     * REtrieves data about an especific product.
     * 
     * This is a public endpoint 
     * 
     * Busca el producto por su ID y comprueba que no pertenezca al outlet.
     * Si no se encuentra, devuelve un error 
     * 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse Product details or error
     * 
     * @OA\Get( 
     *      path="/api/products/{id}", 
     *      summary="Get a product by ID", 
     *      tags={"Products"}, 
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
     *          description="Product not found or belonging to outlet", 
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
        if ($product->has_discount) {
            return response()->json(
                ['message' => 'This product is from the outlet.'],
                404
            );
        }
        return response()->json($product, 200);
    }

    /** 
     * Updates the data of an existing product, whether it is from the outlet or not.
     * 
     * Requires authentication and administrator permissions.  
     * 
     * Allows updating one or more fields of the product. 
     * Returns the updated product if everything is correct. 
     * 
     * Allows updating the `has_discount` field to a truthy value in order to move the product
     * to the outlet endpoint.
     * 
     * @param \Illuminate\Http\Request $request 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse Updated product or error 
     * 
     * @OA\Put( 
     *      path="/api/products/{id}", 
     *      summary="Update a product", 
     *      tags={"Products"}, 
     *      security={{"bearerAuth": {}}},
     *      @OA\Parameter( 
     *          name="id", 
     *          in="path", 
     *          required=true, 
     *          description="ID of the product to update", 
     *          @OA\Schema(type="integer") 
     *      ), @OA\RequestBody( 
     *          required=true, 
     *          @OA\JsonContent( 
     *              ref="#/components/schemas/ProductUpdate" 
     *          ) 
     *      ), 
     *      @OA\Response(
     *          response=200,
     *          description="Product successfully updated",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Product successfully updated"),
     *              @OA\Property(property="product", ref="#/components/schemas/ProductUpdate")
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
     *          description="Product not found", 
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
    public function update(ProductUpdateRequest $request, string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(
                ['message' => 'Product not found'],
                404
            );
        }

        // Actualizamos los campos
        $product->update($request->all());

        return response()->json([
            'message' => 'Product successfully updated',
            'product' => $product,
        ], 200);
    }

    public function updateImage(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->image = asset('storage/' . $path);
            $product->save();

            return response()->json(['message' => 'Image updated']);
        }

        return response()->json(['error' => 'No image provided'], 422);
    }

    public function getFullProduct(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product, 200);
    }

    /** 
     * Elimina un producto que no pertenezca al outlet por su ID. 
     * 
     * Requiere autenticación y permisos de administrador.
     * 
     * Si el producto no existe, devuelve un error 404. 
     * Si se elimina correctamente, devuelve un código 204. 
     * 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse Deletion result
     * 
     * @OA\Delete( 
     *      path="/api/products/{id}", 
     *      summary="Deletes a product", 
     *      tags={"Products"},
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
        if ($product->has_discount) {
            return response()->json(
                ['message' => 'This product is from the outlet.'],
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
