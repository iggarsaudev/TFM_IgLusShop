import React from "react";
import './index.css'
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/CartProvider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TanstackQueryProvider } from "../src/components/provider"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TanstackQueryProvider>
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#f4a261",
                  color: "#fff",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  padding: "1rem 1.5rem",
                },
                success: {
                  icon: "✅",
                  style: {
                    borderColor: "#2a9d8f",
                  },
                },
                error: {
                  icon: "❌",
                  style: {
                    borderColor: "#e76f51",
                  },
                },
              }}
            />
            <AppRouter />
          </TanstackQueryProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
