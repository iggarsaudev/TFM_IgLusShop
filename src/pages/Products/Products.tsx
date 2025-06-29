import { ProductCard } from "../../components/common/ProductCard/ProductCard"
import NavBarCategories from "../../components/common/NavBarCategories/NavBarCategories.tsx"
import { useSearchParams } from "react-router";
import { useProducts } from "../../services/productService.ts";
import toast from "react-hot-toast";


export default function Products() {
  const { data: products, isLoading, error } = useProducts();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const filteredProducts = category ? products?.filter(product => product.category_id === parseInt(String(category))) : products;


  {if (isLoading) return <div>Cargando productos...</div>;}
  {if (error) return <div>{toast.error(`Error loading: ${String(error)}`)}</div>;}
  return (
  <div className="max-w-7xl mx-auto">
    <NavBarCategories section='products'/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>);
};

