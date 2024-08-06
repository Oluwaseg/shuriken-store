import React, { useEffect, useState } from "react";
import { getUserDetails, updateUserProfile, updateUserPassword } from "./api";
import { User, UpdateProfileValues, UpdatePasswordValues } from "./types";
import toast from "react-hot-toast";

const ProfileSettings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profileValues, setProfileValues] = useState<UpdateProfileValues>({
    name: "",
    email: "",
    avatar: null,
  });
  const [passwordValues, setPasswordValues] = useState<UpdatePasswordValues>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserDetails();
        setUser(userData);
        setProfileValues({
          name: userData.name,
          email: userData.email,
          avatar: null,
        });
      } catch (error) {
        toast.error("Error fetching user details.");
      }
    };

    fetchUser();
  }, []);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(profileValues);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile.");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserPassword(passwordValues);
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error("Error updating password.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {user && (
        <>
          <form onSubmit={handleProfileSubmit} className="space-y-6 mb-8">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={profileValues.name}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={profileValues.email}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700"
              >
                Avatar
              </label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setProfileValues((prev) => ({
                    ...prev,
                    avatar: e.target.files?.[0] || null,
                  }))
                }
                className="mt-1 block w-full"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md"
            >
              Update Profile
            </button>
          </form>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordValues.currentPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordValues.newPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordValues.confirmPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md"
            >
              Change Password
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ProfileSettings;
