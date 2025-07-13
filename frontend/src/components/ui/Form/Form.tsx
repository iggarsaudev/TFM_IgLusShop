import React from "react";
import "./form.css";

type FormProps = {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const Form = ({ children, onSubmit }: FormProps) => {
  return (
    <form className="form" onSubmit={onSubmit}>
      {children}
    </form>
  );
}
export default Form