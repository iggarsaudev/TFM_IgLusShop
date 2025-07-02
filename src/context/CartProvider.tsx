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


  return (
    <CartContext.Provider value={{ cart, setCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}