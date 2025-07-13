import api from "./api";

export interface UpdateProfilePayload {
  name?: string;
  password?: string;
  password_confirmation?: string;
}

const updateUserProfile = async (payload: UpdateProfilePayload) => {
  await api.put("/api/user/profile", payload);
};

const uploadUserAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  await api.post("/api/user/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const renewToken = async () => {
  const { data } = await api.post(
    "/api/renew-token",
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return data;
};

const userProfileService = {
  updateUserProfile,
  uploadUserAvatar,
  renewToken,
};

export default userProfileService;
