<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
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
     * @return \Illuminate\Http\JsonResponse Order List 
     * @OA\Get(
     *     path="/api/orders",
     *     summary="Order List",
     *     tags={"Orders"},
     *     security={{"bearerAuth": {}}}, 
     *     @OA\Response(
     *         response=200,
     *         description="Order List",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Order"))
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index()
    {
        $user = Auth::user();

        $orders = $user->role === 'admin'
            ? Order::with('detalles.product')->get()
            : Order::with('detalles.product')->where('user_id', $user->id)->get();

        return response()->json($orders, 200);
    }

    /**
     * Creates a new order with the provided data.
     * 
     * Requires authentication.
     * 
     * @param StoreOrderRequest $request
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Post(
     *     path="/api/orders",
     *     summary="Create new order",
     *     tags={"Orders"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/CreateOrderRequest")),
     *     @OA\Response(response=201, description="Order created successfully", @OA\JsonContent(ref="#/components/schemas/Order")),
     *     @OA\Response(response=404, description="Some products do not exist"),
     *     @OA\Response(response=400, description="Not enough stock for the product"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=422, description="Validation errors", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     */
    public function store(StoreOrderRequest $request)
    {
        #Comprobacion de si el producto existe y si hay suficiente stock
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);

            if ($product->stock < $item['quantity']) {
                return response()->json([
                    'error' => "Not enough stock for the product",
                ], 400);
            }
        }

        return DB::transaction(function () use ($request) {
            $user = Auth::user();
            $total = 0;

            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'total' => 0
            ]);

            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                $subtotal = $product->price * $item['quantity'];

                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                ]);

                // Actualizar stock
                $product->stock -= $item['quantity'];
                $product->save();

                $total += $subtotal;
            }

            $order->update(['total' => $total]);

            return response()->json([
                'message' => 'Order created successfully.',
                'order' => $order->load('detalles.product'),
            ], 201);
        });
    }

    /**
     * Returns data for a specific order.
     * 
     * Requires authentication.
     * 
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Get(
     *     path="/api/orders/{id}",
     *     summary="Show order",
     *     tags={"Orders"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Order found", @OA\JsonContent(ref="#/components/schemas/Order")),
     *     @OA\Response(response=404, description="Resource not found", @OA\JsonContent(ref="#/components/schemas/NotFoundError")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Unauthorized")
     * )
     */
    public function show(string $id)
    {
        $order = Order::with('detalles.product')->find($id);

        if (!$order) {
            throw new ResourceNotFoundException();
        }

        $user = Auth::user();
        if ($user->role !== 'admin' && $order->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($order);
    }

    /**
     * Updates the status of an existing order.
     * 
     * Requires authentication.
     * 
     * @param UpdateOrderRequest $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Patch(
     *     path="/api/orders/{id}/status",
     *     summary="Update order status",
     *     tags={"Orders"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/UpdateOrderStatusRequest")),
     *     @OA\Response(response=200, description="Status updated successfully", @OA\JsonContent(ref="#/components/schemas/Order")),
     *     @OA\Response(response=404, description="Resource not found", @OA\JsonContent(ref="#/components/schemas/NotFoundError")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Unauthorized"),
     *     @OA\Response(response=422, description="Validation errors", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     */
    public function updateStatus(UpdateOrderRequest $request, string $id)
    {
        $order = Order::with('detalles.product')->find($id);

        if (!$order) {
            throw new ResourceNotFoundException();
        }

        $user = $request->user();
        if (!$user->isAdmin() && $user->id !== $order->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Si se está cancelando, restaurar el stock
        if ($request->status === 'cancelled' && $order->status !== 'cancelled') {
            foreach ($order->detalles as $detalle) {
                $product = $detalle->product;
                if ($product) {
                    $product->stock += $detalle->quantity;
                    $product->save();
                }
            }
        }

        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status updated successfully.',
            'order' => $order->refresh()->load('detalles'),
        ], 200);
    }

    /**
     * Cancels an order by its ID.
     * 
     * Requires authentication.
     * 
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Delete(
     *     path="/api/orders/{id}",
     *     summary="Cancel order",
     *     tags={"Orders"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Order successfully cancelled"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Unauthorized"),
     *     @OA\Response(response=404, description="Resource not found", @OA\JsonContent(ref="#/components/schemas/NotFoundError"))
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

        $order->delete();

        return response()->json(['message' => 'Order successfully cancelled.'], 200);
    }
}
