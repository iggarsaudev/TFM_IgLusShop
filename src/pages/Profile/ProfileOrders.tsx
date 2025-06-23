import { useNavigate } from "react-router-dom";
import OrderStatusTag from "../../components/ui/OrderStatusTag/OrderStatusTag";

interface Order {
  id: number;
  status: string;
  total: number;
  created_at: string;
}

interface Props {
  orders: Order[];
}

export default function ProfileOrders({ orders }: Props) {
  const navigate = useNavigate();

  return (
    <div className="profile__orders">
      <h2 className="profile__subtitle">My Orders</h2>
      {orders.length === 0 ? (
        <p className="profile__info">No orders found.</p>
      ) : (
        <ul className="profile__order-list">
          {orders.map((order) => (
            <li key={order.id} className="profile__order-item">
              <p className="profile__order-item_description">
                <strong>ID:</strong> {order.id}
              </p>
              {/* <p className="profile__order-item_description">
                <strong>Status:</strong> {order.status}
              </p> */}
              <OrderStatusTag status={order.status as any} />
              <p className="profile__order-item_description">
                <strong>Total:</strong> {order.total} €
              </p>
              <p className="profile__order-item_description">
                <strong>Date:</strong>{" "}
                {new Date(order.created_at).toLocaleDateString()}
              </p>
              <button
                className="profile__order-detail-btn"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
