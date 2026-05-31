import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaArrowCircleRight, FaUser, FaCube, FaLink as FaLinkIcon, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase.init";
import { toast, Toaster } from "react-hot-toast";

// --- helpers ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function mapFirebaseError(code = "", fallback = "Something went wrong. Please try again.") {
  const normalized = String(code || "").toLowerCase();
  if (normalized.includes("email-already-in-use")) return "This email is already in use.";
  if (normalized.includes("invalid-email")) return "Please enter a valid email address.";
  if (normalized.includes("operation-not-allowed"))
    return "Email/password accounts are disabled in Firebase Auth.";
  if (normalized.includes("weak-password")) return "Password is too weak. Try adding numbers/symbols.";
  if (normalized.includes("network-request-failed"))
    return "Network error. Check your connection and try again.";
  if (normalized.includes("too-many-requests"))
    return "Too many attempts. Please wait a bit and try again.";
  return fallback;
}

const SignUp = () => {
  // UI + form state
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // control/feedback state
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  // validations
  const emailError = useMemo(() => {
    if (!email) return "";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return "";
    if (password.length < 6) return "Password should be at least 6 characters";
    return "";
  }, [password]);

  const canSubmit =
    acceptTerms &&
    fullName.trim().length > 0 &&
    email &&
    password &&
    !emailError &&
    !passwordError;

  // Reset handler
  function handleReset() {
    setFullName("");
    setEmail("");
    setPassword("");
    setAcceptTerms(false);
    setTermsError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTermsError("");

    if (!acceptTerms) {
      setTermsError("You must accept the Terms and Conditions.");
      toast.error("You must accept the Terms and Conditions.", { position: "top-right" });
      return;
    }
    if (password.length < 6) {
      toast.error("Password should be 6 characters or longer", { position: "top-right" });
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const ENABLE_EMAIL_VERIFICATION = true;
      if (ENABLE_EMAIL_VERIFICATION && cred?.user) {
        try {
          await sendEmailVerification(cred.user);
        } catch (ve) {
          console.warn("Email verification send failed:", ve);
        }
      }

      toast.success(
        "Registration successful! Please check your email for verification.",
        { position: "top-right" }
      );
      // Reset form after successful registration
      handleReset();
      // Redirect to sign-in page
      navigate("/sign-in");
    } catch (err) {
      console.log("Firebase error:", err);
      toast.error(mapFirebaseError(err?.code || err?.message), { position: "top-right" });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Blockchain network background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Network nodes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-40 w-5 h-5 bg-blue-400 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-indigo-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-60 left-1/3 w-3 h-3 bg-violet-400 rounded-full animate-pulse delay-500"></div>

        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <line x1="80" y1="80" x2="200" y2="160" stroke="url(#gradient1)" strokeWidth="1" className="animate-pulse" />
          <line x1="200" y1="160" x2="320" y2="240" stroke="url(#gradient2)" strokeWidth="1" className="animate-pulse delay-300" />
          <line x1="160" y1="480" x2="280" y2="400" stroke="url(#gradient3)" strokeWidth="1" className="animate-pulse delay-700" />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative flex flex-col m-6 bg-slate-800/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-700/50 md:flex-row overflow-hidden max-w-6xl">
        {/* Left side */}
        <div className="flex flex-col justify-center p-8 md:p-14 md:w-[28rem]">
          {/* Header with blockchain branding */}
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl mr-4">
              <FaCube className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="block text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Create Wallet
              </span>
              <div className="flex items-center mt-1">
                <FaLinkIcon className="w-4 h-4 text-cyan-400 mr-1" />
                <span className="text-sm text-cyan-400 font-medium">Blockchain Portal</span>
              </div>
            </div>
          </div>

          <span className="font-light text-gray-300 mb-8 text-lg">
            Join the decentralized future
          </span>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="py-1">
              <label className="block mb-2 text-sm font-medium text-gray-300" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl placeholder:font-light placeholder:text-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 text-white"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="py-1">
              <label className="block mb-2 text-sm font-medium text-gray-300" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border-2 rounded-xl placeholder:font-light placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 text-white ${
                    emailError ? "border-red-500 focus:border-red-500" : "border-slate-600 focus:border-cyan-500"
                  }`}
                  placeholder="Enter your email"
                  required
                />
              </div>
              {emailError && <p className="mt-1 text-sm text-red-400">{emailError}</p>}
            </div>

            {/* Password */}
            <div className="py-1">
              <label className="block mb-2 text-sm font-medium text-gray-300" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 bg-slate-700/50 border-2 rounded-xl placeholder:font-light placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 text-white ${
                    passwordError ? "border-red-500 focus:border-red-500" : "border-slate-600 focus:border-cyan-500"
                  }`}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
              {passwordError && <p className="mt-1 text-sm text-red-400">{passwordError}</p>}
              <p className="mt-1 text-xs text-gray-400">Minimum 6 characters. Use a strong passphrase for better security.</p>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={acceptTerms}
                onChange={() => setAcceptTerms((s) => !s)}
                className="h-4 w-4 accent-cyan-500"
              />
              <label htmlFor="acceptTerms" className="text-gray-200 text-sm select-none">
                I accept the{" "}
                <a href="/terms" className="text-cyan-400 underline hover:text-cyan-300">
                  Terms and Conditions
                </a>
              </label>
            </div>
            {termsError && <p className="text-red-400 text-sm -mt-2">{termsError}</p>}

            {/* Submit button only */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`group w-full font-semibold py-3 px-6 rounded-xl mb-2 transform transition-all duration-200 flex items-center justify-center
                  ${
                    canSubmit
                      ? "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/25 text-white"
                      : "bg-slate-700 text-slate-400 cursor-not-allowed"
                  }`}
              >
                <span className="mr-2">Create Account</span>
                <FaArrowCircleRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Feedback banners removed, now using toast */}
          </form>

          {/* Sign in link */}
          <div className="text-center text-gray-300 mt-6">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Right side - Blockchain visualization */}
        <div className="relative md:w-[28rem] min-h-[400px] md:min-h-full">
          {/* Dark gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900"></div>

          {/* Blockchain blocks visualization */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            {/* Block chain */}
            <div className="flex flex-col space-y-4 mb-8">
              {/* Block 1 */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <FaCube className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500"></div>
                </div>
              </div>

              {/* Connection line */}
              <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 mx-auto"></div>

              {/* Block 2 */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <FaShieldAlt className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-0.5 bg-gradient-to-r from-purple-400 to-blue-500"></div>
                </div>
              </div>

              {/* Connection line */}
              <div className="w-0.5 h-6 bg-gradient-to-b from-purple-400 to-blue-500 mx-auto"></div>

              {/* Block 3 */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <FaLinkIcon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Decentralized Security
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm max-w-sm">
                Your data is secured by blockchain technology with immutable records and cryptographic protection
              </p>
            </div>

            {/* Floating particles */}
            <div className="absolute top-8 left-8 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="absolute top-16 right-12 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-300"></div>
            <div className="absolute bottom-20 left-12 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-700"></div>
            <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-violet-400 rounded-full animate-ping delay-1000"></div>
          </div>

          {/* Hash pattern overlay */}
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

export default SignUp;
