import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { register } from "../../features/auth/authSlice";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaApple,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type FormData = {
  name: string;
  email: string;
  password: string;
  avatar?: File;
};

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // State for redirection status
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    dispatch(register(data))
      .unwrap()
      .then(() => {
        setIsRedirecting(true);
        setTimeout(() => {
          navigate("/verify-otp");
        }, 5000);
      })
      .catch(() => toast.error("Registration failed."));
  };

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center">
      {/* Split Screen */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Form Side */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Create an Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                {...formRegister("name", { required: "Name is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

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

            <div className="relative">
              <label htmlFor="password" className="block text-gray-700">
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

            <div>
              <label htmlFor="avatar" className="block text-gray-700">
                Avatar
              </label>
              <input
                id="avatar"
                type="file"
                {...formRegister("avatar")}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isRedirecting
                ? "Redirecting..."
                : loading
                ? "Registering..."
                : "Register"}
            </button>

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </form>

          {/* Social Icons */}
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
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>

        {/* Image Side */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/split-image-1.png')",
          }}
        >
          {/* You can place text or additional content here if needed */}
        </div>
      </div>
    </div>
  );
};

export default Register;
