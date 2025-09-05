import React, { useRef, useState } from "react";
import { FaEye, FaLock, FaShieldAlt, FaCube, FaLink, FaEnvelope, FaEyeSlash } from "react-icons/fa";
import { MdOutlineArrowCircleRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase.init";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { Toaster, toast } from "react-hot-toast";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const mapFirebaseError = (code, message) => {
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/user-not-found":
        return "No account found for this email.";
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Incorrect email or password.";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later.";
      default:
        // fallback to SDK message
        return message || "Something went wrong.";
    }
  };

  // Reset form fields
  function handleReset() {
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
    if (emailRef.current) {
      emailRef.current.value = "";
    }
  }

  // ✅ REAL submit handler with Firebase auth
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // console.log("Signed in user:", result.user);
      setSuccess("Signed in successfully.");
      toast.success("Signed in successfully.", { position: "top-right" });
      handleReset();
    } catch (err) {
      setError(mapFirebaseError(err.code, err.message));
      toast.error(mapFirebaseError(err.code, err.message), { position: "top-right" });
    }
  };

  // ✅ REAL forgot password handler with Firebase
  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    const currentEmail = emailRef.current?.value?.trim() || email.trim();
    if (!currentEmail) {
      setError("Please enter your email to reset password.");
      toast.error("Please enter your email to reset password.", { position: "top-right" });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, currentEmail);
      setSuccess("Password reset email sent. Please check your inbox.");
      toast.success("Password reset email sent. Please check your inbox.", { position: "top-right" });
    } catch (err) {
      setError(mapFirebaseError(err.code, err.message));
      toast.error(mapFirebaseError(err.code, err.message), { position: "top-right" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-40 w-5 h-5 bg-blue-400 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-indigo-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-60 left-1/3 w-3 h-3 bg-violet-400 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Card */}
      <div className="relative flex flex-col m-6 bg-slate-800/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-700/50 md:flex-row overflow-hidden max-w-5xl w-full">
        {/* Left side */}
        <div className="flex flex-col justify-center p-8 gap-x-30 md:p-14 md:w-[480px]">
          {/* Header */}
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl mr-4">
              <FaCube className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="block text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Welcome back
              </span>
              <div className="flex items-center mt-1">
                <FaLink className="w-4 h-4 text-cyan-400 mr-1" />
                <span className="text-sm text-cyan-400 font-medium">
                  Blockchain Portal
                </span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {(error || success) && (
            <div className="mb-2">
              {error && (
                <div
                  className="mb-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                  role="alert"
                >
                  {error}
                </div>
              )}
              {success && (
                <div
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
                  role="status"
                >
                  {success}
                </div>
              )}
            </div>
          )}

          {/* FORM */}
          <form className="space-y-1" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="py-4">
              <label className="block mb-3 text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl placeholder:text-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="py-4">
              <label className="block mb-3 text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl placeholder:text-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot only (REMEMBER ME REMOVED) */}
            <div className="flex justify-end items-center py-3">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-semibold hover:underline transition-colors text-cyan-400 hover:text-cyan-300"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign in */}
            <button
              type="submit"
              className="group w-full font-semibold py-3 px-6 rounded-xl mb-6 transform transition-all duration-200 flex items-center justify-center bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/25"
            >
              <span className="mr-2">
                Access Blockchain
              </span>
              <MdOutlineArrowCircleRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </form>

          {/* Sign up link */}
          <div className="text-center text-gray-300">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/sign-up")}
              className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
            >
              Create wallet
            </button>
          </div>
        </div>

        {/* Right side visualization */}
        <div className="relative md:w-[480px] min-h-[400px] md:min-h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="flex flex-col space-y-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <FaCube className="w-8 h-8 text-white" />
              </div>
              <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 mx-auto"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                <FaShieldAlt className="w-8 h-8 text-white" />
              </div>
              <div className="w-0.5 h-6 bg-gradient-to-b from-purple-400 to-blue-500 mx-auto"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                <FaLink className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Decentralized Security
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm max-w-sm">
                Your data is secured by blockchain technology with immutable
                records and cryptographic protection
              </p>
            </div>
          </div>
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-8 gap-2 h-full p-4">
              {Array.from({ length: 64 }, (_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-sm animate-pulse"
                  style={{ animationDelay: `${i * 50}ms` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
