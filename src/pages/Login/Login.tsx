import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";
import PasswordInput from "../../components/ui/PasswordInput/PasswordInput";
import "./login.css";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login">
      <h1 className="login__title">Login</h1>
      <form className="login__form" onSubmit={handleSubmit}>
        <label className="login__label">
          Email
          <input
            className="login__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter password"
        />
        {error && <p className="login__error">{error}</p>}
        <button className="login__button" type="submit">
          Log in
        </button>
        <p className="login__link">
          Don't have an account?{" "}
          <NavLink to="/register" className={"login__link--register"}>
            Register
          </NavLink>
        </p>
      </form>
    </div>
  );
}
