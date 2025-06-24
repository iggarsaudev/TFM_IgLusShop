import  React from "react";
import "./form.css"

type FormProps = {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function Form({children,onSubmit}: FormProps) {
  return (
    <form className="form" onSubmit={onSubmit}>
        {children}
    </form>
  );
}