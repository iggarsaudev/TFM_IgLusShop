import useAuth from "../../hooks/useAuth";
import "./dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="dashboard">
      <h1 className="dashboard__title">Welcome back, {user?.name}!</h1>
      <p className="dashboard__text">This is your private dashboard area.</p>
    </section>
  );
}
