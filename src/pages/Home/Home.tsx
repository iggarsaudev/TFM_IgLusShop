import { useState,useEffect } from "react"
import { useProducts,useOutlet } from "../../services/productService.ts";
import { useNavigate } from "react-router";
import "./home.css"
import FadeInSection from "./FadeInSection"
import type { ProductType } from "../../types/productTypes.ts";

export default function Home() {
  const { data: normalProducts } = useProducts();
  const { data: outletProducts } = useOutlet();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | "">("");
  
  useEffect(() => {
    const allProducts = [...(normalProducts || []), ...(outletProducts || [])];
    const intervalo = setInterval(() => {
      const random = allProducts[Math.floor(Math.random() * allProducts.length)];
      setProduct(random);
    }, 3000);
        // Limpieza al desmontar el componente
    return () => clearInterval(intervalo);
  }, [normalProducts, outletProducts]); 

  return (
  <div className="home-container">
    <FadeInSection>
      <div className="home-section">
        <p className="home-section_p">Your go-to online shop for top-quality products</p>
      </div>
    </FadeInSection>
    <FadeInSection>
      <div className="middle">
        <div className="left">
          <section className="left-product">
            <div className="left-div">
              <p className="description">Explore the best products across multiple categories</p>
            </div>
            <div className="left-div__button">
              <button className="button-product" onClick={()=>{navigate('products/')}}>Go products <span className="material-symbols-outlined">arrow_forward</span></button>
            </div>
          </section>
          <section className="left-outlet">            
            <div className="left-div">
              <p className="description">Get the best deals on top products</p></div>
            <div className="left-div__button">
              <button className="button-outlet" onClick={()=>{navigate('outlet/')}}>Go outlet <span className="material-symbols-outlined">arrow_forward</span></button>
            </div>
          </section>
        </div>
        <div className="right">
          {product &&  <img className="right-img" src={product.image} alt={product.name}></img>}
        </div>
      </div>
    </FadeInSection>
    <FadeInSection>
    <div className="contact-container">
      <p className="p-contact">Do you have any question?</p>
      <button className="button-outlet" onClick={()=>{navigate('contact/')}}>Contact with us<span className="material-symbols-outlined">arrow_forward</span></button>
    </div>
    </FadeInSection>
  </div>)
}
