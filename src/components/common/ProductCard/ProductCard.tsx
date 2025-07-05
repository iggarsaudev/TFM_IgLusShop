import React from 'react';
import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useCart from "../../../hooks/useCart";
import { Link } from "react-router";
import toast from "react-hot-toast";
import type { ProductType } from '../../../types/productTypes.ts';
import  "./product_card.css";

interface ProductCardProps {
    product: ProductType;
    detail:boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product,detail }) => {
    const navigate = useNavigate();
    const { cart, setCart,  updateQuantity } = useCart()
    const { isAuthenticated } = useAuth();
    const quantityInCart = cart.find((item) => item.id === product.id)?.quantity || 0;


    const handleAdd = () => {
        if (!isAuthenticated) {
            toast.error("You must login before buy")
            navigate("/login");
            return;
        }
        const existingProduct = cart.find((item) => item.id === product.id);

        if (existingProduct) {
            if (existingProduct.quantity < product.stock) {
            updateQuantity(existingProduct, existingProduct.quantity + 1);
            } else {
            toast.error("No more stock available");
            }
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
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
            updateQuantity(existingProduct, existingProduct.quantity - 1);
        }

    };

    return (
        <div className="product-card">
        <img src={product.image} alt={product.name} className={detail ? "product-card__image-detail" :"product-card__image"} />
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
            {detail ?   null  : product.has_discount ? 
            (<Link to={`/outlet/${product.id}`} className="product-card__link">View product</Link>) : 
            (<Link to={`/products/${product.id}`} className="product-card__link">View product</Link>)}
        </div>
        </div>
    );
};

