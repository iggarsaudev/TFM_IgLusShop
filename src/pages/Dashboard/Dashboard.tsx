import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // redirige tras cerrar sesión
  };

  return (
    <section className="dashboard">
      <h1 className="dashboard__title">¡Bienvenido {user?.name}!</h1>
      <p className="dashboard__text">Esta es tu area privada</p>
      <button className="dashboard__logout" onClick={handleLogout}>
        Log out
      </button>
    </section>
  );
}
