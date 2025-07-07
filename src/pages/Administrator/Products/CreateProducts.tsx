import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import toast from "react-hot-toast";
import Spinner from "../../../components/ui/Spinner/Spinner";
import "./createProducts.css";

interface Category {
  id: number;
  name: string;
}

interface Provider {
  id: number;
  name: string;
}

export default function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    has_discount: false,
    discount: 0,
    category_id: 0,
    provider_id: 0,
  });

  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, provRes] = await Promise.all([
          api.get("/api/categories"),
          api.get("/api/providers"),
        ]);
        setCategories(catRes.data);
        setProviders(provRes.data);
      } catch {
        toast.error("Failed to load categories or providers");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    const newValue =
      type === "checkbox" ? checked : type === "number" ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.has_discount && (form.discount <= 0 || form.discount > 100)) {
      toast.error("Discount must be between 1% and 100%");
      return;
    }

    setSubmitting(true);

    try {
      // Creamos el payload: solo añadimos `discount` si aplica
      const payload: any = {
        ...form,
      };

      if (!form.has_discount) {
        delete payload.discount;
      }

      const { data } = await api.post("/api/products", payload);

      if (image) {
        const imageData = new FormData();
        imageData.append("image", image);
        await api.post(`/api/products/${data.id}/image`, imageData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success("Product created successfully!");
      navigate("/admin/products");
    } catch (err: any) {
      if (err.response?.status === 422) {
        const errors = err.response.data?.errors as Record<string, string[]>;
        const first = Object.values(errors)[0]?.[0] || "Validation failed";
        toast.error(first);
      } else {
        toast.error("Error creating product");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <section className="create-product">
      <h2 className="create-product__title">Create New Product</h2>
      <form className="create-product__form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Price (€)
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            min={0}
            step={0.01}
            required
          />
        </label>

        <label>
          Stock
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            min={0}
            required
          />
        </label>

        <label>
          Has Discount
          <input
            type="checkbox"
            name="has_discount"
            checked={form.has_discount}
            onChange={handleChange}
          />
        </label>

        {form.has_discount && (
          <label>
            Discount (%)
            <input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              min={1}
              max={100}
              required
            />
          </label>
        )}

        <label>
          Category
          <select
            name="category_id"
            value={form.category_id}
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

        <label>
          Provider
          <select
            name="provider_id"
            value={form.provider_id}
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

        <label>
          Image
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="create-product__preview"
          />
        )}

        <button
          type="submit"
          className="create-product__btn"
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Product"}
        </button>
      </form>
    </section>
  );
}
