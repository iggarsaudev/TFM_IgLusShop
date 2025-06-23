import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner/Spinner";
import ProfileForm from "./ProfileForm";
import ProfileOrders from "./ProfileOrders";
import "./profile.css";

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data } = await api.get("/api/orders");
        setOrders(data);
      } catch {
        setError("Error loading orders");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAll();
    }
  }, [user]);

  if (loading || !user) return <Spinner />;

  return (
    <section className="profile">
      <h1 className="profile__title">My Profile</h1>

      {success && <p className="profile__success">{success}</p>}
      {error && <p className="profile__error">{error}</p>}

      <ProfileForm />
      <ProfileOrders orders={orders} />
    </section>
  );
}
