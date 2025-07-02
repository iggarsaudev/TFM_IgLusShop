import { CartContext } from "../context/CartContext";
import type { CartContextType } from "../context/CartContext";
import { useContext } from "react";



export default function useCart():CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}