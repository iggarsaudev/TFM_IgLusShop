import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../../services/orderService";
import type { Order } from "../../services/orderService";
import OrderStatusBar from "../../components/ui/OrderStatusBar/OrderStatusBar";
import Spinner from "../../components/ui/Spinner/Spinner";
import "./orderDetail.css";

const validStatuses = [
  "pending",
  "cancelled",
  "processing",
  "sent",
  "delivered",
] as const;
type Status = (typeof validStatuses)[number];

function parseStatus(status: string): Status {
  return validStatuses.includes(status as Status)
    ? (status as Status)
    : "pending";
}

type LocalOrder = Omit<Order, "status"> & { status: Status };

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<LocalOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      try {
        if (!id) throw new Error("Invalid order ID");
        const orderData = await getOrderById(id);

        setOrder({
          ...orderData,
          status: parseStatus(orderData.status),
        });
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
    setError("");
    try {
      await updateOrderStatus(order.id, "cancelled");
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
      <OrderStatusBar status={order.status} />
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
        {order.detalles.map((detalle) => (
          <li className="order-detail__item" key={detalle.id}>
            <div className="order-detail__item-content">
              {detalle.product.image && (
                <img
                  className="order-detail__item-image"
                  src={detalle.product.image}
                  alt={detalle.product.name}
                />
              )}
              <div className="order-detail__item-texts">
                <p className="order-detail__item-description">
                  <strong>{detalle.product.name}</strong>
                </p>
                <p className="order-detail__item-description">
                  Cantidad: {detalle.quantity}
                </p>
                <p className="order-detail__item-description">
                  Precio unitario: {detalle.unit_price} €
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default OrderDetail;
