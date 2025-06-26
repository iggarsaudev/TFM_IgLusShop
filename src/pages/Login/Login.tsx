import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./login.css";
import "../../components/ui/error.css";
import { NavLink } from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import Form from "../../components/ui/Form/Form";
import Input from "../../components/ui/Input/Input";
import ContainerForm from "../../components/ui/ContainerForm/ContainerForm";
import PasswordInput from "../../components/ui/PasswordInput/PasswordInput";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch {
      setError("Invalid credentials");
      setIsSubmitting(false);
    }
  };

  return (
    <ContainerForm title="Login">
      <Form onSubmit={handleSubmit}>
        <Input
          label={"Email"}
          type={"email"}
          name={"email"}
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required={true}
        />
        <PasswordInput
          label={"Password"}
          value={password}
          name={"password"}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        {error && <p className="error">{error}</p>}
        <Button
          text="Log In"
          submittingText="Logging In..."
          isSubmitting={isSubmitting}
          disabled={isSubmitting}
        />
        <p className="login__link">
          Don't have an account?{" "}
          <NavLink to="/register" className={"login__link-register"}>
            Register
          </NavLink>
        </p>
      </Form>
    </ContainerForm>
  );
}
