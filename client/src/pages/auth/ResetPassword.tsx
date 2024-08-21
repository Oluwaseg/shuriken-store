import React from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { resetPassword } from "../../features/auth/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

type FormData = {
  password: string;
  confirmPassword: string;
};

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (token) {
      dispatch(
        resetPassword({
          token,
          password: data.password,
          confirmPassword: data.confirmPassword,
        })
      )
        .unwrap()
        .then(() => {
          navigate("/login");
        })
        .catch(() => {
          toast.error("Failed to reset password.");
        });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Reset Password</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-gray-700">
              New Password
            </label>
            <input
              id="password"
              type="password"
              {...formRegister("password", {
                required: "Password is required",
              })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...formRegister("confirmPassword", {
                required: "Confirm password is required",
              })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {error && (
            <div className="mt-2 text-red-500 text-xs">
              <p>{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
