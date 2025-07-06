import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import toast from "react-hot-toast";
import Spinner from "../../../components/ui/Spinner/Spinner";
import ContainerForm from "../../../components/ui/ContainerForm/ContainerForm";
import Form from "../../../components/ui/Form/Form";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import "./editProductForm.css";

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

interface Category {
  id: number;
  name: string;
}

interface Provider {
  id: number;
  name: string;
}

export default function EditProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes, provRes] = await Promise.all([
          api.get(`/api/products/full/${id}`),
          api.get("/api/categories"),
          api.get("/api/providers"),
        ]);
        const productData = prodRes.data;
        setProduct({
          ...productData,
          has_discount: Boolean(productData.has_discount),
          discount: Number(productData.discount),
        });

        setCategories(catRes.data);
        setProviders(provRes.data);
      } catch {
        toast.error("Failed to load product data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    const parsedValue =
      type === "checkbox" ? checked : type === "number" ? Number(value) : value;

    if (product) {
      setProduct({ ...product, [name]: parsedValue });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !product) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      await api.post(`/api/products/${product.id}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Image updated successfully");
      setSelectedImage(file);
    } catch {
      toast.error("Failed to update image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSubmitting(true);

    try {
      await api.put(`/api/products/${product.id}`, {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        has_discount: product.has_discount,
        discount: product.has_discount ? product.discount : 0,
        category_id: product.category_id,
        provider_id: product.provider_id,
      });

      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch {
      toast.error("Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !product) return <Spinner />;

  return (
    <ContainerForm title="Edit Product">
      <Form onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
        />
        <label className="edit-product-form__label">
          Description
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </label>
        <Input
          label="Price"
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          min={0}
          step={0.01}
          required
        />
        <Input
          label="Stock"
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          min={0}
          required
        />
        <label className="edit-product-form__checkbox">
          <input
            type="checkbox"
            name="has_discount"
            checked={product.has_discount}
            onChange={handleChange}
          />
          Has Discount
        </label>
        {product.has_discount && (
          <Input
            label="Discount (%)"
            type="number"
            name="discount"
            value={product.discount}
            onChange={handleChange}
            min={0}
            max={100}
          />
        )}
        <label className="edit-product-form__label">
          Category
          <select
            name="category_id"
            value={product.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="edit-product-form__label">
          Provider
          <select
            name="provider_id"
            value={product.provider_id}
            onChange={handleChange}
            required
          >
            <option value="">Select provider</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="edit-product-form__label">
          Image
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <div className="edit-product-form__preview">
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : product.image
              }
              alt="Product preview"
            />
            {isUploadingImage && <Spinner />}
          </div>
        </label>

        <Button
          text={submitting ? "Saving..." : "Save"}
          disabled={submitting || isUploadingImage}
        />
      </Form>
    </ContainerForm>
  );
}
