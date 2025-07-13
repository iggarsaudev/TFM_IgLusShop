import "./orderStatusTag.css";

interface Props {
  status: "pending" | "processing" | "sent" | "delivered" | "cancelled";
}

const statusMap = {
  pending: { label: "Pending", icon: "🕓", color: "#f4a261" },
  processing: { label: "Processing", icon: "📦", color: "#2a9d8f" },
  sent: { label: "Sent", icon: "🚚", color: "#264653" },
  delivered: { label: "Delivered", icon: "✅", color: "#3cb371" },
  cancelled: { label: "Cancelled", icon: "❌", color: "#e76f51" },
};

const OrderStatusTag = ({ status }: Props) => {
  const { label, icon, color } = statusMap[status];

  return (
    <span className="order-status-tag" style={{ borderColor: color, color }}>
      <span className="order-status-tag__icon">{icon}</span>
      {label}
    </span>
  );
}
export default OrderStatusTag;