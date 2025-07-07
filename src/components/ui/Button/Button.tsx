import "./button.css";

type ButtonProps = {
  text: string;
  className?: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  submittingText?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

const Button = ({
  text,
  className = "button_submit",
  disabled = false,
  isSubmitting = false,
  submittingText = "Saving...",
  type = "submit",
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={className}
      type={type}
      disabled={disabled || isSubmitting}
      onClick={onClick}
    >
      {isSubmitting && type === "submit" ? submittingText : text}
    </button>
  );
}
export default Button;