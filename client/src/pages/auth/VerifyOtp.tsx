import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { verifyOTP } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom"; // Use useNavigate hook
import { toast } from "react-hot-toast";

type FormData = {
  otp: string;
};

const VerifyOTP: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    setIsVerifying(true);
    dispatch(verifyOTP(data))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch(() => {
        toast.error("OTP verification failed.");
        setIsVerifying(false);
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Your OTP</h2>
        <p className="text-gray-600 mb-4 text-center">
          Enter the OTP sent to your email to verify your account.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-gray-700">
              OTP
            </label>
            <input
              id="otp"
              type="text"
              {...formRegister("otp", { required: "OTP is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              maxLength={6}
            />
            {errors.otp && (
              <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || isVerifying}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isVerifying
              ? "Verifying..."
              : loading
              ? "Processing..."
              : "Verify OTP"}
          </button>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Didn't receive the OTP?{" "}
            <button
              onClick={() =>
                toast.success("Resend OTP functionality not implemented yet")
              }
              className="text-blue-500 hover:underline"
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
