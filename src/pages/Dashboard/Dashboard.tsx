import useAuth from "../../hooks/useAuth";
import "./dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <h1>Panel de Administración, {user?.name}</h1>
    </>
  );
}
