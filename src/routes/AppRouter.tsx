import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import UserLayout from "../layouts/UserLayout";

import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import Outlet from "../pages/Outlet/Outlet";
import Cart from "../pages/Cart/Cart";
import Contact from "../pages/Contact/Contact";
import Reviews from "../pages/Reviews/Reviews";
import Faqs from "../pages/Faqs/Faqs";
import Legal from "../pages/Legal/Legal";
import Cookies from "../pages/Cookies/Cokies";
import NotFound from "../pages/NotFound/NotFound";
import RequireAuth from "./RequireAuth";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import useAuth from "../hooks/useAuth";
import Profile from "../pages/Profile/Profile";
import OrderDetail from "../pages/OrderDetail/OrderDetail";

export default function AppRouter() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Layout público o de usuario logado */}
      <Route
        element={
          isAuthenticated && user?.role === "user" ? (
            <UserLayout />
          ) : (
            <PublicLayout />
          )
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/outlet" element={<Outlet />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Layout de usuario logado */}
      <Route element={<RequireAuth allowedRoles={["user"]} />}>
        <Route element={<UserLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Route>
      </Route>

      {/* Layout admin privado */}
      <Route element={<RequireAuth allowedRoles={["admin"]} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

      {/* Páginas sin layout */}
      <Route path="/legal" element={<Legal />} />
      <Route path="/cookies" element={<Cookies />} />
    </Routes>
  );
}
