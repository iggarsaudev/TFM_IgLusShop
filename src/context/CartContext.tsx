import  { createContext } from "react";
import type { CartItem } from "../types/productTypes";


// Define el tipo para el contexto
export interface CartContextType {
  cart: CartItem[];
  setCart:  React.Dispatch<React.SetStateAction<CartItem[]>>;
  totalItems: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);



