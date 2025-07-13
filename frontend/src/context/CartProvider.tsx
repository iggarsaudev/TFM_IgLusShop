import React from "react";
import {useLocalStorage} from "../hooks/use-local-storeage"; // tu hook personalizado
import type { CartItem } from "../types/productTypes";
import {CartContext} from "./CartContext";

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) =>  {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', [])

  // Calcula la cantidad total de items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const updateQuantity = (product: CartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(product.id)
      return
    }
    if (newQuantity > product.stock) {
      newQuantity = product.stock;
    }
    setCart(cart.map(item =>
      item.id === product.id ? { ...item, quantity: newQuantity } : item
    ))
  }

  return (
    <CartContext.Provider value={{ cart, setCart, clearCart, removeFromCart, updateQuantity, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}