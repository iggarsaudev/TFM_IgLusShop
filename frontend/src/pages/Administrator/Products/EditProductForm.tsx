import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../../components/ui/Spinner/Spinner";
import ContainerForm from "../../../components/ui/ContainerForm/ContainerForm";
import Form from "../../../components/ui/Form/Form";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import {
  useCategories,
  useProviders,
  useUpdateProduct,
  useUploadProductImage,
  useFullProduct,
} from "../../../services/productService";
import "./editProductForm.css";

export default function EditProductForm() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: productData, isPending: loadingProduct } = useFullProduct(id);
  const { data: categories, isPending: loadingCategories } = useCategories();
  const { data: providers, isPending: loadingProviders } = useProviders();

  const updateProduct = useUpdateProduct();
  const uploadImage = useUploadProductImage();

  const [product, setProduct] = useState(productData);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Sync productData with local state when fetched
  useEffect(() => {
    if (productData) {
      setProduct(productData);
    }
  }, [productData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    let parsedValue: string | number | boolean = value;

    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      parsedValue = e.target.checked;
    } else if (type === "number") {
      parsedValue = Number(value);
    }

    if (product) {
      setProduct({ ...product, [name]: parsedValue });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !product) return;

    setIsUploadingImage(true);
    try {
      await uploadImage.mutateAsync({ id: product.id, image: file });
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

    updateProduct.mutate(
      {
        id: product.id,
        product: {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          has_discount: product.has_discount,
          discount: product.has_discount ? product.discount : 0,
          category_id: product.category_id,
          provider_id: product.provider_id,
        },
      },
      {
        onSuccess: () => {
          toast.success("Product updated successfully");
          navigate("/admin/products");
        },
        onError: () => {
          toast.error("Failed to update product");
        },
      }
    );
  };

  if (loadingProduct || loadingCategories || loadingProviders || !product)
    return <Spinner />;

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
            {categories?.map((c) => (
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
            {providers?.map((p) => (
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
          text={
            updateProduct.isPending || isUploadingImage ? "Saving..." : "Save"
          }
          disabled={updateProduct.isPending || isUploadingImage}
        />
      </Form>
    </ContainerForm>
  );
}
