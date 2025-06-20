import axios from "axios";
import { useState } from "react";
import type { UserRegister } from "../../types/authTypes";
import api from "../../services/api";

async function register(datos:UserRegister) {
  try {
    const response = await api.post("/api/register", datos);
    console.log(response.data)
    return response.data.message;
  } catch (error) {
    console.error("Error while creating user:", error);
    throw error; 
  }
}

export default function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data: UserRegister = {
        name: name,
        email: email,
        password:password
      }
      const response = await register(data);
      setMessage(response)
    } catch (error)  {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message || "Form validation error"
          );
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown error while creating user");
        }
      }
  };

  return (
    <div className="register">
      <h1 className="register__title">Register</h1>
      <form className="register__form" onSubmit={handleSubmit}>
         <label className="register__label">
          Name
          <input
            className="register__input"
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="register__label">
          Email
          <input
            className="register__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="register__label">
          Password
          <input
            className="register__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="register__error">{error}</p>}
        {message && <p className="register__message">{message}</p>}
        <button className="register__button" type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
}
