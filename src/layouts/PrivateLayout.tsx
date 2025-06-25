import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./privateLayout.css";

export default function PrivateLayout() {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="private-layout">
      <header className="private-layout__header">
        <span>Área Privada</span>
        <button
          className="private-layout__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </header>

      <div className="private-layout__container">
        <aside
          className={`private-layout__sidebar ${
            menuOpen ? "private-layout__sidebar--open" : ""
          }`}
        >
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/products">Edit Products</NavLink>
          <NavLink to="/admin/users">Edit Users</NavLink>
          <button onClick={logout} className="private-layout__logout">
            Logout
          </button>
        </aside>

        <main className="private-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
