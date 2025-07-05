import { ProductCard } from "../../components/common/ProductCard/ProductCard"
import NavBarCategories from "../../components/common/NavBarCategories/NavBarCategories.tsx"
import { useSearchParams } from "react-router";
import { useProducts } from "../../services/productService.ts"
import Spinner from "../../components/ui/Spinner/Spinner.tsx";
import toast from "react-hot-toast";
import "./product.css"



const Products = () => {
  const { data: products, isLoading, error }  = useProducts();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const filteredProducts = category ? products?.filter(product => product.category_id === parseInt(String(category))) : products;


  {if (isLoading) return <div className="loading-overlay"><Spinner /></div>;}
  {if (error) return <div>{toast.error(`Error loading: ${String(error)}`)}</div>;}
  return (
  <div className="products-page">
    <NavBarCategories section='products'/>
      <div className="products-page__grid">
          {filteredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} detail={false}/>
          ))}
      </div>
    </div>);
};

export default Products
