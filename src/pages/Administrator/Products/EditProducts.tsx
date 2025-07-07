import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import toast from "react-hot-toast";
import Spinner from "../../../components/ui/Spinner/Spinner";
import "./editProducts.css";
import SearchInput from "../../../components/ui/SearchInput/SearchInput";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  has_discount: boolean;
  discount: number;
  category_id: number;
  provider_id: number;
}

export default function EditProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const renderDiscount = (product: Product) => {
    if (!product.has_discount || product.discount <= 0) return null;
    return (
      <p className="edit-products__discount">Descuento: {product.discount}%</p>
    );
  };
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchProducts = async () => {
    try {
      // Hacemos las dos llamadas paralelas
      const [noDiscountRes, discountRes] = await Promise.all([
        api.get("/api/products"), // productos sin descuento
        api.get("/api/outlet"), // productos con descuento
      ]);

      // Combinamos los arrays
      const combinedProducts = [...noDiscountRes.data, ...discountRes.data];

      setProducts(combinedProducts);
    } catch (err) {
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product removed");
    } catch {
      toast.error("Error deleting product");
    }
  };

  const handleEdit = (productId: number) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <Spinner />;

  return (
    <section className="edit-products">
      <h2 className="edit-products__title">Product management</h2>
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by product name"
      />
      <div className="edit-products__grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="edit-products__card">
            <img
              src={product.image}
              alt={product.name}
              className="edit-products__image"
            />
            <h3 className="edit-products__name">{product.name}</h3>
            <p className="edit-products__description">{product.description}</p>
            <p className="edit-products__price">{product.price} €</p>
            {renderDiscount(product)}
            <div className="edit-products__actions">
              <button
                className="edit-products__btn edit-products__btn--edit"
                onClick={() => handleEdit(product.id)}
              >
                Edit
              </button>
              <button
                className="edit-products__btn edit-products__btn--delete"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
