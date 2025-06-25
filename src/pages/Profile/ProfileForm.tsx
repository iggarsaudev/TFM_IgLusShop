import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";
import PasswordInput from "../../components/ui/PasswordInput/PasswordInput";
import toast from "react-hot-toast";
import ContainerForm from "../../components/ui/ContainerForm/ContainerForm";
import Form from "../../components/ui/Form/Form";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";

export default function ProfileForm() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasChanges =
    name.trim() !== user?.name ||
    (password.trim().length >= 8 && password === passwordConfirm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password && password !== passwordConfirm) {
      onError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    const updateData: {
      name?: string;
      password?: string;
      password_confirmation?: string;
    } = {};

    if (name.trim() !== user?.name) updateData.name = name.trim();

    if (password.trim().length >= 8) {
      updateData.password = password.trim();
      updateData.password_confirmation = passwordConfirm.trim();
    }

    if (Object.keys(updateData).length === 0) {
      onError("No changes to update.");
      setIsSubmitting(false);
      return;
    }

    try {
      await api.put("/api/user/profile", updateData);
      toast.success("Profile updated successfully");
      setPassword("");
      setPasswordConfirm("");
      setUser((prev) => ({
        ...prev!,
        ...(updateData.name && { name: updateData.name }),
      }));
    } catch (err: any) {
      if (err.response?.status === 422) {
        const msg = err.response.data?.message || "Validation failed";
        toast.error(msg);
      } else {
        toast.error("Error updating profile");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContainerForm title="">
      <Form onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={true}
        />
        <PasswordInput
          label="New Password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
        />
        <PasswordInput
          label="Confirm New Password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="Confirm new password"
        />
        <Button
          text={isSubmitting ? "Saving..." : "Save Changes"}
          disabled={!hasChanges || isSubmitting}
        />
      </Form>
    </ContainerForm>
  );
}
