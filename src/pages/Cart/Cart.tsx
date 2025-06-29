import { useLocalStorage } from "../../hooks/use-local-storeage"
import type { CartItem } from "../../types/productTypes.ts"
import { Link } from "react-router-dom"
import { useProducts } from "../../services/productService.ts";
import {useCreateOrder} from "../../services/orderService.ts";
import toast from "react-hot-toast";
import "./cart.css"
import Button from "../../components/ui/Button/Button.tsx"


export const Cart = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', [])
  const { data: products } = useProducts()
  const { mutate, isSuccess, error } = useCreateOrder();

  console.log(cart)

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const subtotal = cart.reduce((total, item) => {
    const product = products?.find(p => p.id === item.id)
    return total + (product ? parseFloat(String(product.price)) * item.quantity : 0)
  }, 0)

  const tax = subtotal * 0.21

  const total = subtotal + tax

  const handleCreateOrder = (event:React.FormEvent) => {
    event.preventDefault();
    const orderData = {
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    mutate(orderData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your shopping cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="cart-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 4 0z" />
          </svg>
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <Link to="/products" className="cart-link">
            Go shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 mt-4">
          {/* Lista de productos en el carrito */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cart.map(item => {
                    const product = products?.find(p => p.id === item.id)
                    if (!product) return null

                    const itemTotal = parseFloat(String(product.price)) * item.quantity

                    return (
                      <tr key={`${item.id}-${item.quantity}-${itemTotal}`}>
                        <td>
                          <div className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                className="h-16 w-16 object-cover"
                                src={product.image}
                                alt={product.name}
                              />
                              <div className="ml-4 mr-4">
                              <Link
                                to={`/product/${product.id}`}
                                className="cart-link"
                              >
                                {product.name}
                              </Link>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${product.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center border rounded-md w-28">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 text-gray-600 hover:text-gray-800"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                              className="w-10 text-center border-0 focus:outline-none"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 hover:text-gray-800"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">${itemTotal.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div className="px-6 py-4 border-t">
                <div className="flex justify-between">
                  <Link to="/products" className="cart-link">
                    ← Seguir comprando
                  </Link>
                  <button
                    onClick={clearCart}
                    className="border-b-black rounded p-2 text-white bg-red-600 hover:bg-red-800"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (21%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <form onSubmit={handleCreateOrder}>
                <Button text="Complete Order"/>
                {isSuccess && toast.success("Order Create")}
                {error && toast.error("Failed to create the order")}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}