import { useEffect, useState } from 'react';
import { ProductCard } from "../../components/common/ProductCard/ProductCard"
import NavBarCategories from "../../components/common/NavBarCategories/NavBarCategories.tsx"
import type  { ProductType } from './../../types/productTypes.ts';
import api from "../../services/api";
import { useSearchParams } from "react-router";
import "./outlet.css"
import type { AxiosResponse } from 'axios';


async function getOutlet():Promise<AxiosResponse<ProductType[]>> {
  try {
    const response = await api.get("/api/outlet");
    return response;
  } catch (error) {
    console.error("Error while fetching products:", error);
    throw error;
  }
}

export default function Outlet() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const filteredProducts = category ? products?.filter(product => product.category_id === parseInt(String(category))) : products;
   useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getOutlet();
                const data = response.data
                
                setProducts(data); // Axios devuelve la data en response.data
            } catch {
                console.error('Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
      return (<div className="outlet-page">
              <NavBarCategories section='outlet'/>
              {loading ?  <p>Loading products...</p> :
                <div className="outlet-page__grid">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                }
        </div>);
};