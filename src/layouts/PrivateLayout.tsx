import { Outlet } from "react-router-dom";
import "./privateLayout.css";

export default function PrivateLayout() {
  return (
    <div className="private-layout">
      <header className="private-layout__header">
        <h1 className="private-layout__title">Private Area</h1>
      </header>
      <main className="private-layout__main">
        <Outlet />
      </main>
    </div>
  );
}
