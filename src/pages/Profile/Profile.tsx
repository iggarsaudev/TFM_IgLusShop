import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";
import "./profile.css";

interface Order {
  id: number;
  status: string;
  total: number;
  created_at: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPassword("");
      setPasswordConfirm("");
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/api/orders");
        setOrders(data);
      } catch (err) {
        console.error("Error loading orders");
      }
    };
    fetchOrders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.trim() !== passwordConfirm.trim()) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    try {
      const updateData: {
        name?: string;
        password?: string;
        password_confirmation?: string;
      } = {};

      if (name.trim() !== user?.name) updateData.name = name.trim();

      if (password.trim().length >= 8) {
        updateData.password = password.trim();
        updateData.password_confirmation = passwordConfirm.trim();
      }

      if (Object.keys(updateData).length === 0) {
        setError("No changes to update.");
        setSuccess("");
        return;
      }

      await api.put("/api/user/profile", updateData);

      setSuccess("Profile updated successfully");
      setError("");
      setPassword("");
      setPasswordConfirm("");
    } catch (err: any) {
      if (err.response?.status === 422) {
        console.error("Errores del backend:", err.response.data);
        const backendMsg = err.response.data?.message || "Validation failed";
        setError(backendMsg);
      } else {
        setError("Error updating profile");
      }
      setSuccess("");
    }
  };

  const hasChanges =
    name.trim() !== user?.name ||
    (password.trim().length >= 8 && password.trim() === passwordConfirm.trim());

  return (
    <section className="profile">
      <h1 className="profile__title">My Profile</h1>

      <form className="profile__form" onSubmit={handleSubmit}>
        <label className="profile__label">
          Name
          <input
            className="profile__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="profile__label">
          New Password (min 8 chars)
          <input
            className="profile__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current"
          />
        </label>
        <label className="profile__label">
          Confirm New Password
          <input
            className="profile__input"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Confirm new password"
          />
        </label>
        {success && <p className="profile__success">{success}</p>}
        {error && <p className="profile__error">{error}</p>}
        <button
          className="profile__button"
          type="submit"
          disabled={!hasChanges}
        >
          Save Changes
        </button>
      </form>

      <div className="profile__orders">
        <h2 className="profile__subtitle">My Orders</h2>
        {orders.length === 0 ? (
          <p className="profile__info">No orders found.</p>
        ) : (
          <ul className="profile__order-list">
            {orders.map((order) => (
              <li key={order.id} className="profile__order-item">
                <p>
                  <strong>ID:</strong> {order.id}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Total:</strong> {order.total} €
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
