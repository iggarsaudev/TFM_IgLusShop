import { useState } from "react";
import "./passwordInput.css";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  name?: string;
}

const PasswordInput = ({
  value,
  onChange,
  placeholder = "Enter password",
  label,
  required = false,
  name,
}: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <label className="password-input__label">
      {label}
      <div className="password-input__wrapper">
        <input
          className="password-input__input"
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          name={name}
        />
        <button
          type="button"
          className="password-input__toggle"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
        >
          <span className="material-symbols-outlined">
            {visible ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
    </label>
  );
}
export default PasswordInput;