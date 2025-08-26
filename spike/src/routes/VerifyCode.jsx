import React, { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.jpg";
import verifyIMG from "../assets/verifyCode.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyAndSignup, sendotp } from "../Services/operations/authAPI";

const VerifyCodePage = () => {
  const [code, setCode] = useState("");
  const [codeVisible, setCodeVisible] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formData = location.state;

  // Redirect back to signup if no form data
  useEffect(() => {
    if (!formData) {
      navigate("/signup");
    }
  }, [formData, navigate]);

  const handleVerify = (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      alert("Please enter the verification code");
      return;
    }
    
    if (!formData) {
      alert("Session expired. Please start over.");
      navigate("/signup");
      return;
    }
    
    dispatch(
      verifyAndSignup(
        formData.fullName,
        formData.userName,
        formData.phoneNumber,
        formData.email,
        formData.password,
        formData.confirmPassword,
        code,
        navigate
      )
    );
  };

  const handleResendOTP = () => {
    if (!formData) {
      alert("Session expired. Please start over.");
      navigate("/signup");
      return;
    }
    
    setIsResending(true);
    dispatch(
      sendotp(
        formData.fullName,
        formData.userName,
        formData.phoneNumber,
        formData.email,
        formData.password,
        formData.confirmPassword,
        navigate
      )
    ).finally(() => {
      setIsResending(false);
    });
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-[#F9FCD4] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Session expired. Please start over.</p>
          <button 
            onClick={() => navigate("/signup")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Go to Signup
          </button>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen flex items-center justify-center px-4">
  <div className="flex w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl backdrop-blur-md bg-gray-900/90 border border-gray-700">
    <div className="w-1/2 p-8 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <img src={logo} alt="Logo" className="h-20 w-auto" />
        </div>
        
        <button
          className="mb-6 flex items-center text-sm font-medium text-gray-400 hover:text-gray-200 transition"
          onClick={() => navigate("/signup")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to signup
        </button>
        
        <h1 className="text-2xl font-bold mb-2 text-white">Verify code</h1>
        <p className="mb-2 text-sm text-gray-300">
          An authentication code has been sent to your email.
        </p>
        <p className="mb-8 text-sm text-gray-200 font-medium">
          {formData.email}
        </p>
        
        <form className="space-y-6" onSubmit={handleVerify}>
          <div className="relative">
            <label htmlFor="code" className="block mb-1 text-xs font-semibold text-gray-300">
              Enter Code
            </label>
            <input
              id="code"
              type={codeVisible ? "text" : "password"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter OTP"
              className="w-full rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
              required
              maxLength={6}
            />
            <button
              type="button"
              className="absolute right-2 top-[30px] text-gray-400 hover:text-red-400 transition-colors"
              onClick={() => setCodeVisible(!codeVisible)}
            >
              {codeVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          <button 
            type="submit" 
            className="w-full rounded-md bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50 shadow-lg hover:shadow-red-500/25"
            disabled={!code.trim()}
          >
            Verify
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={isResending}
            className="text-sm text-red-400 hover:text-red-300 font-medium disabled:opacity-50 transition-colors"
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
    
    <div className="w-1/2 bg-transparent flex items-center justify-center p-6">
      <img 
        src={verifyIMG} 
        alt="Verify Illustration" 
        className="max-w-full max-h-[400px] object-contain" 
      />
    </div>
  </div>
</div>
  );
};

export default VerifyCodePage;