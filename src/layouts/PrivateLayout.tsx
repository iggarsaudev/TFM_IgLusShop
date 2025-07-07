import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./privateLayout.css";
import Button from "../components/ui/Button/Button";
import toast from "react-hot-toast";
import api from "../services/api";


const PrivateLayout = () => {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const { logout, canRenew, setCanRenew } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const interval = setInterval(() => {
      const expiresAtString = localStorage.getItem("token_expires_at");
      if (!expiresAtString) return;

      const expiresAt = new Date(expiresAtString).getTime();
      const now = Date.now();
      const timeLeftMs = expiresAt - now;
      setCanRenew(timeLeftMs > 0 && timeLeftMs <= 5 * 60 * 1000);
    }, 30000);

    return () => clearInterval(interval);
  }, [setCanRenew]);

  const handleRenewToken = async () => {
    setIsRenewing(true);
    try {
      const { data } = await api.post(
        "/api/renew-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("token_expires_at", data.expires_at);
      toast.success("Token renewed successfully");
      setCanRenew(false);
    } catch {
      toast.error("Error renewing token");
    } finally {
      setIsRenewing(false);
    }
  };

  return (
    <div className="global">
      <header className="header">
        <div className="header__logo">
          IgLu's<span className="header__logo--highlight">Admin</span>
        </div>

        <button
          className={`header__toggler ${
            menuOpen ? "header__toggler--active" : ""
          }`}
          onClick={toggleMenu}
        >
          <span className="header__toggler-icon material-symbols-outlined">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </header>

      <main className="main-layout">
        <aside
          className={`main-layout__sidebar ${
            menuOpen ? "main-layout__sidebar--open" : ""
          }`}
        >
          <NavLink to="/admin/users" className="sidebar-nav__link">
            Edit Users
          </NavLink>
          <NavLink to="/admin/products" className="sidebar-nav__link">
            Edit Products
          </NavLink>
          <NavLink to="/admin/create-products" className="sidebar-nav__link">
            Create Products
          </NavLink>
          <NavLink to="/dashboard" className="sidebar-nav__link">
            Dashboard
          </NavLink>

          <div className="sidebar__actions">
            <button onClick={logout} className="sidebar__btn">
              Logout
            </button>
            <button
              onClick={handleRenewToken}
              className="sidebar__btn"
              disabled={!canRenew || isRenewing}
            >
              {isRenewing ? "Renewing..." : "Renew Token"}
            </button>
          </div>
        </aside>

        <section className="main-layout__content">
          <Outlet />
        </section>
      </main>

      <footer className="footer">
        <div className="header__logo">
          IgLu's<span className="header__logo--highlight">Admin</span>
        </div>
        <p className="footer__info">
          &copy; 2025 IgLu'S Shop. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
export default PrivateLayout