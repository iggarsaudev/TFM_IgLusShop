import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../../components/ui/Spinner/Spinner";
import SearchInput from "../../../components/ui/SearchInput/SearchInput";
import usersService from "../../../services/userService";
import type { User } from "../../../types/authTypes";
import "./editUsers.css";

export default function EditUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "user" | "admin">("all");

  const fetchUsers = async () => {
    try {
      const users = await usersService.getAllUsers();
      setUsers(users);
    } catch {
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await usersService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Error deleting user");
    }
  };

  const handleRoleChange = async (id: number, newRole: "user" | "admin") => {
    try {
      await usersService.updateUserRole(id, newRole);
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) return <Spinner />;

  return (
    <section className="edit-users">
      <h2 className="edit-users__title">Manage Users</h2>

      <div className="edit-users__controls">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name"
        />
        <div className="edit-users__filters">
          <label>
            <input
              type="radio"
              name="role-filter"
              checked={filterRole === "all"}
              onChange={() => setFilterRole("all")}
            />
            All
          </label>
          <label>
            <input
              type="radio"
              name="role-filter"
              checked={filterRole === "user"}
              onChange={() => setFilterRole("user")}
            />
            User
          </label>
          <label>
            <input
              type="radio"
              name="role-filter"
              checked={filterRole === "admin"}
              onChange={() => setFilterRole("admin")}
            />
            Admin
          </label>
        </div>
      </div>

      <ul className="edit-users__list">
        {filteredUsers.map((user) => (
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
