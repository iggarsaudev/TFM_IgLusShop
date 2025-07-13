import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router";
import ProductCard from "../../components/common/ProductCard/ProductCard"
import NavBarCategories from "../../components/common/NavBarCategories/NavBarCategories.tsx"
import Spinner from "../../components/ui/Spinner/Spinner.tsx";
import api from "../../services/api";
import type  { ProductType } from './../../types/productTypes.ts';
import type { AxiosResponse } from 'axios';
import "./outlet.css"


async function getOutlet():Promise<AxiosResponse<ProductType[]>> {
  try {
    const response = await api.get("/api/outlet");
    return response;
  } catch (error) {
    console.error("Error while fetching products:", error);
    throw error;
  }
}

const Outlet = () => {
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
              {loading ?  <div className="loading-overlay"><Spinner /></div> :
                <div className="outlet-page__grid">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} detail={false} />
                    ))}
                </div>
                }
        </div>);
};
export default Outlet;