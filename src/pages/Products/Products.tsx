import { useEffect, useState } from 'react';
import { ProductCard } from "../../components/common/ProductCard/ProductCard"
import NavBarCategories from "../../components/common/NavBarCategories/NavBarCategories.tsx"
import type  { ProductType } from './../../types/productTypes.ts';
import { useSearchParams } from "react-router";
import api from "../../services/api";


async function getProducts() {
  try {
    const response = await api.get("/api/products");
    console.log(response)
    return response;
  } catch (error) {
    console.error("Error while fetching products:", error);
    throw error;
  }
}

export default function Products() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const filteredProducts = category ? products?.filter(product => product.category_id === parseInt(String(category))) : products;
   useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getProducts();
                setProducts(response.data); // Axios devuelve la data en response.data
            } catch {
                console.error('Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
      return (
        <>
      <div className="max-w-7xl mx-auto">
              <NavBarCategories section='products'/>
              {loading ?  <p>Loading products...</p> :
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                }
        </div>
        </>);
};

