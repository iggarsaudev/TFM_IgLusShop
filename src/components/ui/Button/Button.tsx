import "./button.css";

type ButtonProps = {
  text: string;
  className?: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  submittingText?: string;
};

export default function Button({
  text,
  className = "button_submit",
  disabled,
  isSubmitting = false,
  submittingText = "Logging in...",
}: ButtonProps) {
  return (
    <button
      className={className}
      type="submit"
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? submittingText : text}
    </button>
  );
}
