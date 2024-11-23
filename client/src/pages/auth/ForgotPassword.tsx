import React from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { forgotPassword, resetAuthState } from "../../features/auth/authSlice";
import { useEffect } from "react";

type FormData = {
  email: string;
};

const ForgotPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    // Clear error on component mount
    dispatch(resetAuthState());
  }, [dispatch]);

  const onSubmit = (data: FormData) => {
    dispatch(forgotPassword(data.email))
      .unwrap()
      .then(() => {
        // Handle additional feedback or reset form if needed
        dispatch(resetAuthState()); // Clear error if needed
      })
      .catch(() => {
        // Error will be handled by the authSlice, no need to use toast here
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Forgot Password</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...formRegister("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
