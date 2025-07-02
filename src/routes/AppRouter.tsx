import { Routes, Route } from "react-router-dom";
import PrivateLayout from "../layouts/PrivateLayout";

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
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import OrderDetail from "../pages/OrderDetail/OrderDetail";

import RequireAuth from "./RequireAuth";
import PublicUserLayout from "../layouts/PublicUserLayout";
import Orders from "../pages/Orders/Orders";
import Profile from "../pages/Profile/Profile";
import EditProducts from "../pages/Administrator/EditProducts/EditProducts";
import EditUsers from "../pages/Administrator/EditUsers/EditUsers";

export default function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas o de usuario logado con layout combinado */}
      <Route element={<PublicUserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/outlet" element={<Outlet />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="*" element={<NotFound />} />

        {/* Páginas accesibles solo para usuarios autenticados con rol "user" */}
        <Route element={<RequireAuth allowedRoles={["user"]} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<Orders />} />
          <Route path="/profile/orders/:id" element={<OrderDetail />} />
        </Route>
      </Route>

      {/* Layout privado para admins */}
      <Route element={<RequireAuth allowedRoles={["admin"]} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<EditProducts />} />
          <Route path="/admin/users" element={<EditUsers />} />
        </Route>
      </Route>

      {/* Páginas legales sin layout */}
      <Route path="/legal" element={<Legal />} />
      <Route path="/cookies" element={<Cookies />} />
    </Routes>
  );
}
