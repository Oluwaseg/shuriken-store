import axios from "axios";
import { UpdateProfileValues, UpdatePasswordValues } from "./types";

export const getUserDetails = async () => {
  const response = await axios.get("/api/user/me");
  return response.data.user;
};

export const updateUserProfile = async (data: UpdateProfileValues) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }
  const response = await axios.put("/api/user/me/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.user;
};

export const updateUserPassword = async (data: UpdatePasswordValues) => {
  const response = await axios.put("/api/user/password/update", data);
  return response.data;
};
