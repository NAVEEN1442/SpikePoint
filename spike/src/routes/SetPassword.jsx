import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.jpg";         // ✅ Replace with your actual logo path
import resetIMG from "../assets/setPassword.png"; // ✅ Replace with your image asset path

const SetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br ">
  <div className="flex w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl backdrop-blur-md bg-white border border-gray-200">

    {/* Left form section */}
    <div className="w-1/2 p-8 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-6">
          <img src={logo} alt="Logo" className="h-20 w-auto" />
        </div>

        {/* Back button */}
        <button className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </button>

        {/* Heading */}
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Set a password</h1>
        <p className="mb-8 text-sm text-gray-600 max-w-sm">
          Your previous password has been reset. Please set a new password for your account.
        </p>

        {/* Password form */}
        <form className="space-y-6">
          {/* New password */}
          <div className="relative">
            <label htmlFor="new-password" className="block mb-1 text-xs font-semibold text-gray-700">
              Create Password
            </label>
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="7789BM6X@@H&S$K_"
              className="w-full rounded-md bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-[30px] text-gray-500 hover:text-blue-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Confirm password */}
          <div className="relative">
            <label htmlFor="confirm-password" className="block mb-1 text-xs font-semibold text-gray-700">
              Re-enter Password
            </label>
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              placeholder="7789BM6X@@H&S$K_"
              className="w-full rounded-md bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2 top-[30px] text-gray-500 hover:text-blue-600 transition-colors"
            >
              {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25"
          >
            Set password
          </button>
        </form>
      </div>
    </div>

    {/* Right image section */}
    <div className="w-1/2 bg-transparent flex items-center justify-center p-6">
      <img src={resetIMG} alt="Reset password illustration" className="max-w-full max-h-[400px] object-contain" />
    </div>
  </div>
</div>

  );
};

export default SetPasswordPage;