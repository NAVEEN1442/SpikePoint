import React from "react";
import { ArrowLeft } from "lucide-react";
import forgotPassword from '../assets/forgot-pass.png';
import logo from '../assets/logo.jpg'; // <-- Add your logo path here
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
  <div className="flex flex-col md:flex-row w-full bg-transparent max-w-5xl overflow-hidden rounded-xl shadow-lg ">

    {/* ⇦ Form section */}
    <div className="w-full md:w-1/2 p-8 md:p-12 ">
      
      {/* 🖼 Logo */}
      <div className="mb-6">
        <img src={logo} alt="Logo" className="h-20 w-auto" />
      </div>

      {/* 🔙 Back to login */}
      <Link to={"/login"}>
        <button className="mb-6 flex items-center text-sm font-medium text-gray-300 hover:text-white transition">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </button>
      </Link>

      {/* ✉️ Heading and form */}
      <h1 className="text-2xl font-bold mb-2 text-white">Forgot your password?</h1>
      <p className="mb-8 text-sm text-gray-400 max-w-sm">
        Don't worry, happens to all of us. Enter your email below to recover your password.
      </p>

      <form className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-xs font-semibold text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="john.doe@gmail.com"
            className="w-full rounded-md border border-gray-600 px-4 py-2 text-sm text-white placeholder-gray-400 bg-gray-800 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black"
        >
          Submit
        </button>
      </form>

      {/* Divider */}
      <div className="my-8 flex items-center">
        <span className="h-px flex-1 bg-gray-600" />
        <span className="px-4 text-xs uppercase tracking-wider text-gray-400">
          Or login with
        </span>
        <span className="h-px flex-1 bg-gray-600" />
      </div>

      {/* Google login button */}
      <button className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-600 py-2.5 text-sm font-medium text-gray-200 bg-gray-800 transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black">
        <svg
          className="h-5 w-5"
          viewBox="0 0 533.5 544.3"
          aria-hidden="true"
        >
          <path d="M533.5 278.4c0-17.6-1.6-35.2-4.8-52.2H272v98.9h146.4c-6.3 34.5-25 63.7-53.2 83.5l86.1 66.9c50.3-46.4 82.2-114.8 82.2-197.1z" fill="#4285F4" />
          <path d="M272 544.3c71.6 0 131.7-23.6 175.6-64.1l-86.1-66.9c-24 16.1-54.9 25.7-89.5 25.7-68.9 0-127.3-46.4-148.3-108.9H34.7v68.5C78.4 497.7 168.8 544.3 272 544.3z" fill="#34A853" />
          <path d="M123.7 329.9c-10.1-29.7-10.1-61.6 0-91.3v-68.5H34.7c-37 74.1-37 161.7 0 235.7l89-68.5z" fill="#FBBC05" />
          <path d="M272 107.7c38.9-.6 76 13.9 104.2 39.7l78.1-78.1C411.2 23.6 351.1 0 272 0 168.8 0 78.4 46.6 34.7 140.1l89 68.5C144.7 154.1 203.1 107.7 272 107.7z" fill="#EA4335" />
        </svg>
        Google
      </button>
    </div>

    {/* ➡ Illustration section */}
    <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-900">
      <img src={forgotPassword} alt="Forgot password illustration" />
    </div>
  </div>
</div>
  );
};

export default ForgotPasswordPage;
