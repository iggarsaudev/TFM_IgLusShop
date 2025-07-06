import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import OrderStatusBar from "../../components/ui/OrderStatusBar/OrderStatusBar";
import Spinner from "../../components/ui/Spinner/Spinner";
import "./orderDetail.css";

interface Order {
  id: number;
  status: string;
  total: number;
  created_at: string;
  detalles: {
    id: number;
    quantity: number;
    unit_price: number;
    product: {
      name: string;
    };
  }[];
}

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/api/orders/${id}`);
        setOrder(data);
      } catch {
        setError("Unable to load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;

    setCanceling(true);
    try {
      await api.patch(`/api/orders/${order.id}/status`, {
        status: "cancelled",
      });
      setOrder({ ...order, status: "cancelled" });
    } catch {
      setError("Unable to cancel order");
    } finally {
      setCanceling(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="order-detail__error">{error}</p>;
  if (!order) return null;

  return (
    <section className="order-detail">
      <h1 className="order-detail__title">Order #{order.id}</h1>
      <OrderStatusBar status={order.status as any} />
      <p className="order-detail__date">
        <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
      </p>
      <p className="order-detail__total">
        <strong>Total:</strong> {order.total} €
      </p>

      <button
        className="order-detail__cancel-btn"
        onClick={handleCancel}
        disabled={order.status !== "pending" || canceling}
      >
        {canceling ? "Cancelling..." : "Cancel Order"}
      </button>

      {order.status !== "pending" && (
        <p className="order-detail__info">
          {order.status === "cancelled"
            ? "This order has already been cancelled."
            : "This order can no longer be cancelled."}
        </p>
      )}

      <h2 className="order-detail__subtitle">Items</h2>
      <ul className="order-detail__item-list">
        {order.detalles.map((item) => (
          <li key={item.id} className="order-detail__item">
            <p className="order-detail__item-description">
              <strong>Product:</strong> {item.product.name}
            </p>
            <p className="order-detail__item-description">
              <strong>Quantity:</strong> {item.quantity}
            </p>
            <p className="order-detail__item-description">
              <strong>Unit Price:</strong> {item.unit_price} €
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
export default OrderDetail;