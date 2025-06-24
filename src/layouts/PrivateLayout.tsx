import { Outlet } from "react-router-dom";
import "./privateLayout.css";
import useAuth from "../hooks/useAuth";

export default function PrivateLayout() {
  const { logout } = useAuth();

  return (
    <div className="private-layout">
      <header className="private-layout__header">
        <h1 className="private-layout__title">Area Privada</h1>

        <div className="header__actions">
          <button onClick={logout} className="header__login-btn">
            Logout
          </button>
        </div>
      </header>
      <main className="private-layout__main">
        <Outlet />
      </main>
    </div>
  );
}
