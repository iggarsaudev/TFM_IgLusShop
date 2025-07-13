import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../../components/ui/Spinner/Spinner";
import SearchInput from "../../../components/ui/SearchInput/SearchInput";
import {
  useProducts,
  useOutlet,
  useDeleteProductGeneral,
} from "../../../services/productService";
import "./editProducts.css";
import type { ProductType } from "../../../types/productTypes";

export default function EditProducts() {
  const navigate = useNavigate();

  const {
    data: products = [],
    isPending: loadingProducts,
    error: errorProducts,
  } = useProducts();
  const {
    data: outlet = [],
    isPending: loadingOutlet,
    error: errorOutlet,
  } = useOutlet();
  const deleteProductMutation = useDeleteProductGeneral();

  const [searchTerm, setSearchTerm] = useState("");
  const [combinedProducts, setCombinedProducts] = useState<typeof products>([]);

  useEffect(() => {
    const productsWithFlag = products.map((p) => ({ ...p, isOutlet: false }));
    const outletWithFlag = outlet.map((p) => ({ ...p, isOutlet: true }));
    setCombinedProducts([...productsWithFlag, ...outletWithFlag]);
  }, [products, outlet]);

  useEffect(() => {
    if (errorProducts || errorOutlet) {
      toast.error("Error loading products");
    }
  }, [errorProducts, errorOutlet]);

  const filteredProducts = combinedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDiscount = (product: (typeof combinedProducts)[number]) => {
    if (!product.has_discount || product.discount <= 0) return null;
    return (
      <p className="edit-products__discount">Descuento: {product.discount}%</p>
    );
  };

  const handleDelete = (product: ProductType) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    deleteProductMutation.mutate(
      {
        id: product.id,
        isOutlet: product.isOutlet ?? false,
      },
      {
        onSuccess: () => toast.success("Product removed"),
        onError: () => toast.error("Error deleting product"),
      }
    );
  };

  const handleEdit = (productId: number) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  if (loadingProducts || loadingOutlet) return <Spinner />;

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
            <p className="edit-products__description">Stock: {product.stock}</p>
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
                onClick={() => handleDelete(product)}
                disabled={deleteProductMutation.isPending}
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
