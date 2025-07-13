import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/ui/Spinner/Spinner";
import OrderStatusTag from "../../components/ui/OrderStatusTag/OrderStatusTag";
import { getOrders, type Order } from "../../services/orderService";
import "./orders.css";

const OrderItem = ({ order }: { order: Order }) => {
  const navigate = useNavigate();

  return (
    <li className="profile__order-item">
      <p className="profile__order-item_description">
        <strong>ID:</strong> {order.id}
      </p>
      <OrderStatusTag status={order.status as any} />
      <p className="profile__order-item_description">
        <strong>Total:</strong> ${Number(order.total).toFixed(2)}
      </p>
      <p className="profile__order-item_description">
        <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
      </p>
      <button
        className="profile__order-detail-btn"
        onClick={() => navigate(`/profile/orders/${order.id}`)}
      >
        View Details
      </button>
    </li>
  );
};

const Orders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch {
        setError("Error loading orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <Spinner />;
  if (error) return <p className="profile__error">{error}</p>;
  if (!user)
    return (
      <p className="profile__info">You must be logged in to view orders.</p>
    );

  return (
    <div className="profile__orders">
      <h1 className="profile__subtitle">My Orders</h1>
      {orders.length === 0 ? (
        <p className="profile__info">No orders found.</p>
      ) : (
        <ul className="profile__order-list">
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
