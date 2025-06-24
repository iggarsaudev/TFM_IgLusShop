import axios from "axios";
import { useState } from "react";
import type { UserRegister } from "../../types/authTypes";
import "./register.css";
import api from "../../services/api";
import "../../components/ui/error.css";
import  Button from "../../components/ui/Button/Button";
import  Form from "../../components/ui/Form/Form";
import  Input from "../../components/ui/Input/Input";
import  ContainerForm from "../../components/ui/ContainerForm/ContainerForm";
import { useNavigate } from 'react-router-dom';


async function register(datos:UserRegister) {
  try {
    const response = await api.post("/api/register", datos);
    return response.data.message;
  } catch (error) {
    console.error("Error while creating user:", error);
    throw error; 
  }
}

export default function Register() {
  const navigate = useNavigate();
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
      navigate('/login');
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
      <ContainerForm title="Register">
      <Form onSubmit={handleSubmit}>
        <Input label={"Name"}
            type={"text"}
            name={"name"}
            value={name}
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            required={true}/>
        <Input label={"Email"}
            type={"email"}
            name={"email"}
            value={email}
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required={true}/>
        <Input label={"Password"}
            type={"password"}
            name={"password"}
            value={password}
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required={true}/>
          {error && <p className="error">{error}</p>}
          {message && <p className="register__message">{message}</p>}
          <Button text={"Sign In"}/>
      </Form>
      </ContainerForm>
  );
}
