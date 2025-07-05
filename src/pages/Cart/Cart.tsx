import { Link } from "react-router-dom"
import { useProducts,useOutlet } from "../../services/productService.ts";
import {useCreateOrder} from "../../services/orderService.ts";
import toast from "react-hot-toast";
import "./cart.css"
import Button from "../../components/ui/Button/Button.tsx"
import useCart from "../../hooks/useCart.ts";



const Cart = () => {
  const { cart, clearCart, removeFromCart, updateQuantity } = useCart()
  
  const { data: normalProducts } = useProducts()
  const { data: outletProducts } = useOutlet();

  const allProducts = [...(normalProducts || []), ...(outletProducts || [])];
  const { mutate, isSuccess, error } = useCreateOrder();

  const subtotal = cart.reduce((total, item) => {
    const product = allProducts?.find(p => p.id === item.id)
    const price = product ? (product.has_discount ? parseFloat((product.price * (1 - product.discount / 100)).toFixed(2))* item.quantity : parseFloat(String(product.price)) * item.quantity) : 0
    return total + price
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
    clearCart()
  };

  return (
  <div className="cart">
    <h1 className="cart__title">Your shopping cart</h1>

    {cart.length === 0 ? (
      <div className="cart__empty">
        <svg xmlns="http://www.w3.org/2000/svg" className="cart__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 4 0z" />
        </svg>
        <p className="cart__empty-text">Your cart is empty</p>
        <Link to="/products" className="cart__link">
          Go shopping
        </Link>
      </div>
    ) : (
      <div className="cart__content">
        {/* Lista de productos */}
        <div className="cart__products">
          <div className="cart__table-wrapper">
            <table className="cart__table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Amount</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => {
                  const product = allProducts?.find(p => p.id === item.id)
                  if (!product) return null

                  const itemTotal = (product.has_discount ? parseFloat((product.price * (1 - product.discount / 100)).toFixed(2))* item.quantity : parseFloat(String(product.price)) * item.quantity)

                  return (
                    <tr key={`${item.id}-${item.quantity}-${itemTotal}`}>
                      <td>
                        <div className="cart__product">
                          <img className="cart__product-image" src={product.image} alt={product.name} />
                          <div className="cart__product-info">
                            <Link to={`/product/${product.id}`} className="cart__link">
                              {product.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td>${product.has_discount ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price}</td>
                      <td>
                        <div className="cart__quantity">
                          <button onClick={() => updateQuantity(item, item.quantity - 1)}>-</button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item, parseInt(e.target.value))}
                          />
                          <button onClick={() => updateQuantity(item, item.quantity + 1)}  disabled={item.quantity >= item.stock}>+</button>
                        </div>
                      </td>
                      <td><strong>${itemTotal.toFixed(2)}</strong></td>
                      <td>
                        <button onClick={() => removeFromCart(item.id)} className="cart__remove">Eliminar</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="cart__footer">
              <Link to="/products" className="cart__link">← Seguir comprando</Link>
              <button onClick={clearCart} className="cart__clear">Vaciar carrito</button>
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="cart__summary">
          <h2 className="cart__summary-title">Order Summary</h2>
          <div className="cart__summary-item">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart__summary-item">
            <span>IVA (21%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="cart__summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <form onSubmit={handleCreateOrder}>
            <Button text="Complete Order" />
            {isSuccess && toast.success("Order Create")}
            {error && toast.error("Failed to create the order")}
          </form>
        </div>
      </div>
    )}
  </div>
)
}

export default Cart