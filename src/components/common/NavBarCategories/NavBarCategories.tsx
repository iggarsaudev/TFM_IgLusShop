import { useEffect, useState } from 'react';
import type  { ProductType } from '../../../types/productTypes.ts';
import { Link } from "react-router";
import api from "../../../services/api.ts";
import "./nav_bar_categories.css";

type NavBarCategoriesProps = {
  section: string;
}

async function getCategories() {
  try {
    const response = await api.get("/api/categories");
    return response;
  } catch (error) {
    console.error("Error while fetching products:", error);
    throw error;
  }
}
const NavBarCategories = ({section }:NavBarCategoriesProps) => {
  const [categories, setCategories] = useState<ProductType[]>([]);
   useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data); // Axios devuelve la data en response.data
            } catch {
                console.error('Failed to fetch categories');
            } 
        }

        fetchData();
    }, []);
      return (
      <nav className="categories">
        <ul className="categories__list">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={`/${section}?category=${category.id}`}
                className="category-link"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>);
};
export default NavBarCategories;