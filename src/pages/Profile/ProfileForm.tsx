import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";
import PasswordInput from "../../components/ui/PasswordInput/PasswordInput";
import toast from "react-hot-toast";

export default function ProfileForm() {
  const { user } = useAuth();
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
    <form className="profile__form" onSubmit={handleSubmit}>
      <label className="profile__label">
        Name
        <input
          className="profile__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <PasswordInput
        label="New Password (min 8 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
      />
      <PasswordInput
        label="Confirm new password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        placeholder="Confirm new password"
      />
      <button
        className="profile__button"
        type="submit"
        disabled={!hasChanges || isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
