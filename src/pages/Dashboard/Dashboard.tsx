import useAuth from "../../hooks/useAuth";
import "./dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <h1>Administration Panel, {user?.name}</h1>
    </>
  );
}
