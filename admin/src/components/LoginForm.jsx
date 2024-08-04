import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Circle from "./Circle";
import Shuriken from "./Shuriken";
import { HiEye, HiEyeOff } from "react-icons/hi";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    const { email, password } = data;
    const notifySuccess = () => toast.success("Login successful");
    const notifyError = (message) => toast.error(message);

    try {
      const action = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(action)) {
        if (action.payload.token) {
          notifySuccess();
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } else {
        const errorMessage =
          action.payload?.message || "Login failed. Please try again.";
        notifyError(errorMessage);
      }
    } catch (err) {
      notifyError("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <HelmetProvider>
        <Helmet>
          <title>Admin Login</title>
          <meta name="description" content="Admin Login Page" />
        </Helmet>
      </HelmetProvider>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-center gap-2.5 font-medium py-3 mb-3 mx-auto">
          <div className={`relative w-12 h-12`}>
            <Circle />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shuriken className="w-1/2 h-1/2 object-contain" />
            </div>
          </div>

          <motion.span
            className="text-2xl whitespace-pre font-semibold"
            initial={{ rotate: 0, y: 0, color: "#000" }}
            animate={{
              rotate: [0, 360],
              y: [0, -10, 0],
              color: ["#000", "#ff6347", "#000"],
            }}
            transition={{
              rotate: {
                duration: 2,
                ease: "easeInOut",
              },
              y: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              },
              color: {
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0.5,
              },
            }}
          >
            Admin Panel
          </motion.span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="admin@admin.com"
              {...register("email", { required: "Email is required" })}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="•••••••••"
                {...register("password", { required: "Password is required" })}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? (
                  <HiEyeOff className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-secondary text-white font-semibold rounded-md shadow-sm hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default LoginForm;
