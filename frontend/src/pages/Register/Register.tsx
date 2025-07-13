import axios from "axios";
import { useState } from "react";
import type { UserRegister } from "../../types/authTypes";
import "./register.css";
import api from "../../services/api";
import "../../components/ui/error.css";
import Button from "../../components/ui/Button/Button";
import Form from "../../components/ui/Form/Form";
import Input from "../../components/ui/Input/Input";
import ContainerForm from "../../components/ui/ContainerForm/ContainerForm";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/ui/PasswordInput/PasswordInput";
import toast from "react-hot-toast";

async function register(datos: UserRegister) {
  try {
    const response = await api.post("/api/register", datos);
    return response.data;
  } catch (error) {
    console.error("Error while creating user:", error);
    throw error;
  }
}

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const data: UserRegister = {
        name: name,
        email: email,
        password: password,
      };
      const response = await register(data);
      setMessage(response);
      toast.success(response.message || "Successful registration");
      navigate("/login");
      setIsSubmitting(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Form validation error";
        setError(msg);
        toast.error(msg);
      } else if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError("Unknown error while creating user");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContainerForm title="Register">
      <Form onSubmit={handleSubmit}>
        <Input
          label={"Name"}
          type={"text"}
          name={"name"}
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          required={true}
        />
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
        {message && <p className="register__message">{message}</p>}
        <Button
          text="Register"
          submittingText="Registering..."
          isSubmitting={isSubmitting}
          disabled={isSubmitting}
        />
      </Form>
    </ContainerForm>
  );
};
export default Register;
