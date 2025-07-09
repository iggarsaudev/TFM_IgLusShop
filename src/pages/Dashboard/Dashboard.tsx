import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import userProfileService from "../../services/userProfileService";
import PasswordInput from "../../components/ui/PasswordInput/PasswordInput";
import toast from "react-hot-toast";
import ContainerForm from "../../components/ui/ContainerForm/ContainerForm";
import ProfileAvatar from "../../components/ui/ProfileAvatar/ProfileAvatar";
import Form from "../../components/ui/Form/Form";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import Spinner from "../../components/ui/Spinner/Spinner";
import "./dashboard.css";

export default function Dashboard() {
  const { user, setUser, canRenew, setCanRenew, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

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
      await userProfileService.updateUserProfile(updateData);
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
    setIsUploadingAvatar(true);

    try {
      await userProfileService.uploadUserAvatar(file);
      toast.success("Profile picture updated");
      await refreshUser();
    } catch (err) {
      toast.error("Error updating profile picture");
      console.error(err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const expiresAtString = localStorage.getItem("token_expires_at");
      if (!expiresAtString) return;

      const expiresAt = new Date(expiresAtString).getTime();
      const now = Date.now();
      const timeLeftMs = expiresAt - now;

      setCanRenew(timeLeftMs > 0 && timeLeftMs <= 5 * 60 * 1000);
    }, 30000);

    return () => clearInterval(interval);
  }, [setCanRenew]);

  const handleRenewToken = async () => {
    setIsRenewing(true);
    try {
      const data = await userProfileService.renewToken();

      localStorage.setItem("token", data.token);
      localStorage.setItem("token_expires_at", data.expires_at);
      toast.success("Token renewed successfully");
      setCanRenew(false);
    } catch (err) {
      toast.error("Error renewing token");
    } finally {
      setIsRenewing(false);
    }
  };

  return (
    <ContainerForm title={`Administration Panel, ${user?.name}`}>
      <Form onSubmit={handleSubmit}>
        <div
          className="profile__avatar-wrapper"
          style={{ position: "relative" }}
        >
          <ProfileAvatar
            avatarUrl={
              user?.avatar
                ? `http://localhost:8000/storage/${user.avatar}`
                : undefined
            }
            onChange={handleAvatarChange}
          />
          {isUploadingAvatar && (
            <div
              className="profile__avatar-spinner"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            >
              <Spinner />
            </div>
          )}
        </div>
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
          disabled={!hasChanges || isSubmitting || isUploadingAvatar}
        />
      </Form>

      {canRenew && (
        <Button
          text={isRenewing ? "Renewing token..." : "Renew Token"}
          onClick={handleRenewToken}
          disabled={isRenewing}
        />
      )}
    </ContainerForm>
  );
}
