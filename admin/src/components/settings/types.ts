export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  createdAt: string;
}

export interface UpdateProfileValues {
  name: string;
  email: string;
  avatar?: File | null;
}

export interface UpdatePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
