import "./container_form.css";
import React from "react";

type ContainerFormProps = {
  title: string;
  children: React.ReactNode;
};

export default function ContainerForm({ title, children }: ContainerFormProps) {
  return (
    <div className="container">
      <h1 className="title">{title}</h1>
      {children}
    </div>
  );
}
