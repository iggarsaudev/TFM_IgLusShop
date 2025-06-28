<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ResourceNotFoundException;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;

class OrderController extends Controller
{
    /**
     * Returns a list of all orders registered in the database.
     * 
     * Requires authentication.
     * 
     * If you are the admin role, it will display all orders. If you are a user, it will only display your own orders.
     * 
     * This function retrieves all records from the Order model and returns them in JSON format. Each order includes the user_id, date, status, and total.
     * 
     * @return \Illuminate\Http\JsonResponse Order List 
     * @OA\Get(
     *     path="/api/orders",
     *     summary="Order List",
     *     tags={"Orders"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Response(
     *          response=200, 
     *          description="Order List", 
     *          @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Order"))
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     * )
     */
    public function index()
    {
        $user = Auth::user(); // obtenemos el usuario autenticado

        $orders = $user->role === 'admin'
            ? Order::with('detalles')->get() // si es admin te traes todos
            : Order::with('detalles')->where('user_id', $user->id)->get(); // si no es admin te traes los de ese usuario. 'detalles' viene de la función detalles() del model Order

        return response()->json($orders, 200);
    }


    /**
     * Creates a new order with the provided data.
     * 
     * Requires authentication.
     * 
     * Validates required fields before storing the resource.
     * Returns the created user ID and a confirmation message if the operation is successful.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse Created user ID and confirmation message
     * @OA\Post(
     *     path="/api/orders",
     *     summary="Create new order",
     *     tags={"Orders"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/CreateOrderRequest")),
     *     @OA\Response(
     *          response=201, 
     *          description="Order created successfully", 
     *          @OA\JsonContent(ref="#/components/schemas/Order")
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation errors",
     *         @OA\JsonContent(ref="#/components/schemas/ValidationError")
     *     )
     * )
     */
    public function store(StoreOrderRequest $request)
    {
        return DB::transaction(function () use ($request) { // se realiza todo en una transacción, si algo falla se vuelve a atrás para no dejar cosas a medias
            $user = Auth::user();
            $total = 0;

            // Creamos el pedido en pendiente para el usuario que se ha logado
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'total' => 0
            ]);

            // Calculamos el total recorriendo los productos
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                $subtotal = $product->price * $item['quantity'];

                // Guardamos los detalles                
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                ]);

                $total += $subtotal;
            }

            $order->update(['total' => $total]);

            return response()->json([
                'message' => 'Order created successfully.',
                'order' => $order->load('detalles'),
            ], 201);
        });
    }

    /**
     * Returns data for a specific order.
     * 
     * Requires authentication.
     * 
     * If you are the admin role, you will be able to access all orders; if you are a user, you will only access your own orders.
     * 
     * Searches for the order by its ID. If it is not found, an error is returned.
     * 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse Order details or error message
     * 
     * @OA\Get(
     *     path="/api/orders/{id}",
     *     summary="Show order",
     *     tags={"Orders"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200, 
     *         description="Order found", 
     *         @OA\JsonContent(ref="#/components/schemas/Order")
     *     ),
     *     @OA\Response(
     *         response=404, 
     *         description="Resource not found",
     *         @OA\JsonContent(ref="#/components/schemas/NotFoundError")
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
    public function show(string $id)
    {
        $order = Order::with('detalles.product')->find($id);

        if (!$order) {
            throw new ResourceNotFoundException();
        }

        $user = Auth::user();
        // Comprobamos si el usuario es admin o si el pedido pertenece al usuario logado
        if ($user->role !== 'admin' && $order->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($order);
    }

    /**
     * Updates the data of an existing order.
     * 
     * Requires authentication.
     * 
     * If you are an admin role, you can update all orders; if you are a user, you will only update your orders.
     * 
     * Allows you to update the order status.
     * Returns the updated order if everything is correct. 
     * 
     * @param \Illuminate\Http\Request $request 
     * @param string $id 
     * @return \Illuminate\Http\JsonResponse Order updated or error message
     * 
     * @OA\Patch(
     *     path="/api/orders/{id}/status",
     *     summary="Update order status",
     *     tags={"Orders"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *          required=true, 
     *          @OA\JsonContent(ref="#/components/schemas/UpdateOrderStatusRequest")
     *     ),
     *     @OA\Response(
     *          response=200, 
     *          description="Status updated successfully", 
     *          @OA\JsonContent(ref="#/components/schemas/Order")
     *     ),
     *     @OA\Response(
     *          response=404, 
     *          description="Resource not found",
     *          @OA\JsonContent( ref="#/components/schemas/NotFoundError" )
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
     *          response=422, 
     *          description="Validation errors", 
     *          @OA\JsonContent( 
     *              ref="#/components/schemas/ValidationError" 
     *          ) 
     *      ) 
     * )
     */
    public function updateStatus(UpdateOrderRequest $request, string $id)
    {
        $order = Order::find($id);

        if (!$order) {
            throw new ResourceNotFoundException();
        }

        $user = $request->user();

        // Permitir solo si es admin o es propietario del pedido
        if (!$user->isAdmin() && $user->id !== $order->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status updated successfully.',
            'order' => $order->refresh()->load('detalles'),
        ], 200);
    }

    /**
     * Cancel an order by its ID.
     * 
     * Requires authentication.
     * 
     * If you are the admin role, you can cancel any order. If you are a user, you will only cancel your own orders.
     * 
     * If the order doesn't exist, a 404 error is returned.
     * If the order is canceled successfully, a 204 code is returned.
     * 
     * @OA\Delete(
     *     path="/api/orders/{id}",
     *     summary="Cancel order",
     *     tags={"Orders"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(
     *          response=200, 
     *          description="Order successfully cancelled"
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
     *          response=404, 
     *          description="Resource not found", 
     *          @OA\JsonContent( ref="#/components/schemas/NotFoundError" )
     *     ), 
     * )
     */
    public function destroy(string $id)
    {
        $order = Order::find($id);

        if (!$order) {
            throw new ResourceNotFoundException();
        }

        $user = Auth::user();
        if ($user->role !== 'admin' && $order->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->update(['status' => 'cancelled']);
        return response()->json([
            'message' => 'Order successfully cancelled'
        ], 200);
    }
}
