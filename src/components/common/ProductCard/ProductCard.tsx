import React,{useState} from 'react';
import { Link } from "react-router";
import { useNavigate } from "react-router";
import  "./product_card.css";
import type { ProductType, CartItem } from '../../../types/productTypes.ts';
import { useLocalStorage } from "../../../hooks/use-local-storeage.ts";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";




interface ProductCardProps {
    product: ProductType;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [quantityInCart, setQuantityInCart] = useState(0);
    const navigate = useNavigate();
    const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
    const { isAuthenticated } = useAuth();

    const handleAdd = () => {
        if (!isAuthenticated) {
            toast.error("You must login before buy")
            navigate("/login");
            return;
        }
        const existingProduct = cart.find((item) => item.id === product.id);

        if (existingProduct) {
            setCart(cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        }
        else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        if (quantityInCart < product.stock) {
        setQuantityInCart((prev) => prev + 1);
        }
    };

    const handleRemove = () => {
        if (!isAuthenticated) {
            toast.error("You must login before buy")
            navigate("/login");
            return;
        }
        const existingProduct = cart.find((item) => item.id === product.id);

        if (existingProduct) {
            setCart(cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
            ));
        }

        setQuantityInCart((prev) => (prev > 0 ? prev - 1 : 0));
    };
    return (
        <div className="border p-4 rounded shadow-md">
            <img src={product.image} alt={product.name} className="w-full h-80 object-cover mb-2" />
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            
            {product.has_discount ? (
            <>
                <p className="text-green-600 font-semibold">
                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </p>
                <p className="text-red-600 font-semibold line-through">
                ${product.price}
                </p>
            </>
            ) : (
            <p className="text-green-600 font-semibold">
                ${product.price}
            </p>
            )}
            
            <div className="mt-4 flex justify-between gap-2">
                <div className="flex items-center gap-2">
                    <button
                    onClick={handleRemove}
                    disabled={quantityInCart === 0}
                    className="button-card"
                    >
                    -
                    </button>
                    <span className="text-sm font-medium">
                    {quantityInCart}
                    </span>

                    <button
                    onClick={handleAdd}
                    disabled={quantityInCart >= product.stock}
                    className="button-card"
                    >
                    +
                    </button>
                </div>

                <Link to={`/products/${product.id}`} className="button-card">View product</Link>
            </div>
        </div>
    );
};

