import React,{useState} from 'react';
import { Link } from "react-router";
import { useNavigate } from "react-router";
import  "./product_card.css";
import type { ProductType } from '../../../types/productTypes.ts';
import useAuth from "../../../hooks/useAuth";
import useCart from "../../../hooks/useCart";
import toast from "react-hot-toast";




interface ProductCardProps {
    product: ProductType;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [quantityInCart, setQuantityInCart] = useState(0);
    const navigate = useNavigate();
    const { cart, setCart } = useCart();
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
        <div className="product-card">
        <img src={product.image} alt={product.name} className="product-card__image" />
        <h2 className="product-card__title">{product.name}</h2>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__stock">Stock: {product.stock}</p>

        {product.has_discount ? (
            <>
            <p className="product-card__price--discounted">
                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
            </p>
            <p className="product-card__price--original">
                ${product.price}
            </p>
            </>
        ) : (
            <p className="product-card__price">${product.price}</p>
        )}

        <div className="product-card__actions">
            <div className="product-card__quantity">
            <button
                onClick={handleRemove}
                disabled={quantityInCart === 0}
                className="product-card__button"
            >
                -
            </button>
            <span className="product-card__quantity-number">{quantityInCart}</span>
            <button
                onClick={handleAdd}
                disabled={quantityInCart >= product.stock}
                className="product-card__button"
            >
                +
            </button>
            </div>

            <Link to={`/products/${product.id}`} className="product-card__link">View product</Link>
        </div>
        </div>
    );
};

