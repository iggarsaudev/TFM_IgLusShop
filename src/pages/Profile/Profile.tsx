import useAuth from "../../hooks/useAuth";
import ProfileForm from "./ProfileForm";
import "./profile.css";

export default function Profile() {
  const { user } = useAuth();

  return (
    <section className="profile">
      <p>Welcome, {user?.name}</p>
      <ProfileForm />
    </section>
  );
}
