import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";
import PasswordInput from "../../components/ui/PasswordInput/PasswordInput";
import toast from "react-hot-toast";
import ContainerForm from "../../components/ui/ContainerForm/ContainerForm";
import ProfileAvatar from "../../components/ui/ProfileAvatar/ProfileAvatar";
import Form from "../../components/ui/Form/Form";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import "./profile.css";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshUser } = useAuth();

  const hasChanges =
    name.trim() !== user?.name ||
    (password.trim().length >= 8 && password === passwordConfirm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password && password !== passwordConfirm) {
      toast.error("Passwords do not match");
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
      toast.error("No changes to update.");
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

  const handleAvatarChange = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await api.post("/api/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile picture updated");
      refreshUser();
    } catch (err) {
      toast.error("Error updating profile picture");
      console.error(err);
    }
  };

  return (
    <ContainerForm title="My profile">
      <Form onSubmit={handleSubmit}>
        <ProfileAvatar
          avatarUrl={
            user?.avatar
              ? `http://localhost:8000/storage/${user.avatar}`
              : undefined
          }
          onChange={handleAvatarChange}
        />
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
