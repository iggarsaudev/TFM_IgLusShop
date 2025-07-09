import api from "./api";
import type { User } from "../types/authTypes";

const getAllUsers = async () => {
  const { data } = await api.get<User[]>("/api/users");
  return data;
};

const deleteUser = async (id: number) => {
  await api.delete(`/api/users/${id}`);
};

const updateUserRole = async (id: number, role: "user" | "admin") => {
  await api.put(`/api/users/${id}`, { role });
};

const usersService = {
  getAllUsers,
  deleteUser,
  updateUserRole,
};

export default usersService;
