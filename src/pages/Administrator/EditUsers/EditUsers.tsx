import { useEffect, useState } from "react";
import api from "../../../services/api";
import toast from "react-hot-toast";
import Spinner from "../../../components/ui/Spinner/Spinner";
import "./editUsers.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export default function EditUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/api/users");
      setUsers(data);
    } catch {
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Error deleting user");
    }
  };

  const handleRoleChange = async (id: number, newRole: "user" | "admin") => {
    try {
      await api.put(`/api/users/${id}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
      toast.success("Role updated");
    } catch {
      toast.error("Error updating role");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <Spinner />;

  return (
    <section className="edit-users">
      <h2 className="edit-users__title">Manage Users</h2>
      <ul className="edit-users__list">
        {users.map((user) => (
          <li key={user.id} className="edit-users__item">
            <div className="edit-users__info">
              <strong>{user.name}</strong> ({user.email})
            </div>
            <div className="edit-users__roles">
              <label>
                <input
                  type="radio"
                  name={`role-${user.id}`}
                  checked={user.role === "user"}
                  onChange={() => handleRoleChange(user.id, "user")}
                />
                User
              </label>
              <label>
                <input
                  type="radio"
                  name={`role-${user.id}`}
                  checked={user.role === "admin"}
                  onChange={() => handleRoleChange(user.id, "admin")}
                />
                Admin
              </label>
            </div>
            <button
              className="edit-users__delete"
              onClick={() => handleDelete(user.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
