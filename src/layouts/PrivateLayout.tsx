import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./privateLayout.css";
import Button from "../components/ui/Button/Button";
import toast from "react-hot-toast";
import api from "../services/api";

export default function PrivateLayout() {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const { canRenew, setCanRenew } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      const expiresAtString = localStorage.getItem("token_expires_at");
      if (!expiresAtString) return;

      const expiresAt = new Date(expiresAtString).getTime();
      const now = Date.now();
      const timeLeftMs = expiresAt - now;

      // se activa solo si quedan menos de 5 minutos
      setCanRenew(timeLeftMs > 0 && timeLeftMs <= 5 * 60 * 1000);
    }, 30000); // se revisa cada 30 segundos

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
    } catch (err) {
      toast.error("Error renewing token");
    } finally {
      setIsRenewing(false);
    }
  };

  return (
    <div className="private-layout">
      <header className="private-layout__header">
        <span>Área Privada</span>
        <button
          className="private-layout__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ?
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
          <Button
            text={isRenewing ? "Renewing..." : "Renew Token"}
            disabled={!canRenew || isRenewing}
            onClick={handleRenewToken}
            className="button__renew"
          />
        </aside>

        <main className="private-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
