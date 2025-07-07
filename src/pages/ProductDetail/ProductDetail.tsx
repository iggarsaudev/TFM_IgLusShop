import ProductReviews from "../../components/common/ProductReviews/ProductReviews.tsx";
import { useProduct,useOutletProduct } from "../../services/productService.ts";
import toast from "react-hot-toast";
import Spinner from "../../components/ui/Spinner/Spinner.tsx";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard/ProductCard"
import  "./productDetail.css";

interface detailProps  {
  type : "product" | "outlet"
}
const ProductDetail = ({type}: detailProps) => {
  const { id } = useParams()
  const numericId = Number(id);
  const product = useProduct(numericId);
  const outlet = useOutletProduct(numericId);

  const data = type === "product" ? product.data : outlet.data;
  const isLoading = type === "product" ? product.isLoading : outlet.isLoading;
  const error = type === "product" ? product.error : outlet.error;
  return (
    <>
        {error && toast.error("Error deleting review")}
        {isLoading && (
            <div className="loading-overlay">
              <Spinner />
            </div>
          )}
         {data && (
        <>
          <h1 className="detail-title">{data.name}</h1>
          <div className="detail-container">
            <section className="detail-section">
              <ProductCard product={data} detail={true} />
            </section>
              <ProductReviews productId={numericId} />
          </div>
        </>
      )}
    </>
  )
}
export default ProductDetail;