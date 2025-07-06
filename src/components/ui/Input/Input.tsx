import React from "react";
import "./input.css";

type InputProps = {
  label: string;
  type: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
};

export default function Input({
  label,
  type,
  name,
  value,
  onChange,
  required = false,
  placeholder = "",
}: InputProps) {
  return (
    <label className="form__label">
      {label}
      <input
        className="form__input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </label>
  );
}
