import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { login } from "../../features/auth/authSlice";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaApple,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type FormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    dispatch(login(data))
      .unwrap()
      .then(() => {
        navigate("/home");
      })
      .catch(() => {});
  };

  return (
    <div className="flex min-h-screen bg-primary justify-center items-center">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-transparent shadow-lg rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-accent">
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

            <div className="relative">
              <label htmlFor="password" className="block text-accent">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...formRegister("password", {
                    required: "Password is required",
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center h-full"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && (
              <div className="mt-2 text-red-500 text-xs">
                {error ===
                "User not verified. Please verify your email address." ? (
                  <p>
                    {error}{" "}
                    <a
                      href="/resend-otp"
                      className="text-blue-500 hover:underline"
                    >
                      Resend OTP
                    </a>
                  </p>
                ) : null}
              </div>
            )}
            {/* Forgot Password Link */}
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                <a
                  href="/forgot-password"
                  className="text-blue-500 hover:underline"
                >
                  Forgot Password?
                </a>
              </p>
            </div>
          </form>

          <div className="mt-6 flex justify-center gap-4">
            <a
              href="/google"
              className="p-2 border rounded-full hover:bg-gray-100"
            >
              <FaGoogle className="text-red-500 w-5 h-5" />
            </a>
            <a
              href="/facebook"
              className="p-2 border rounded-full hover:bg-gray-100"
            >
              <FaFacebook className="text-blue-600 w-5 h-5" />
            </a>
            <a
              href="/apple"
              className="p-2 border rounded-full hover:bg-gray-100"
            >
              <FaApple className="text-gray-800 w-5 h-5" />
            </a>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-500 hover:underline">
                Register
              </a>
            </p>
          </div>
        </div>

        {/* Image Side */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/split-image-2.png')",
          }}
        >
          {/* You can place text or additional content here if needed */}
        </div>
      </div>
    </div>
  );
};

export default Login;
