import "./orderStatusBar.css";

interface Props {
  status: "pending" | "processing" | "sent" | "delivered" | "cancelled";
}

const steps = [
  { key: "pending", label: "Pending", icon: "🕓" },
  { key: "processing", label: "Processing", icon: "📦" },
  { key: "sent", label: "Sent", icon: "🚚" },
  { key: "delivered", label: "Delivered", icon: "✅" },
];

const OrderStatusBar = ({ status }: Props) =>  {
  const currentIndex = steps.findIndex((step) => step.key === status);
  const isCancelled = status === "cancelled";

  return (
    <div
      className={`order-status ${isCancelled ? "order-status--cancelled" : ""}`}
    >
      {steps.map((step, index) => (
        <div
          key={step.key}
          className={`order-status__step ${
            index < currentIndex
              ? "order-status__step--complete"
              : index === currentIndex
              ? "order-status__step--current"
              : ""
          }`}
        >
          <div className="order-status__icon">{step.icon}</div>
          <div className="order-status__label">{step.label}</div>
          {index < steps.length - 1 && <div className="order-status__bar" />}
        </div>
      ))}
    </div>
  );
}
export default OrderStatusBar;