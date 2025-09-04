import React, { useRef, useState } from "react";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase.init";
import {
  FaEye,
  FaLock,
  FaShieldAlt,
  FaCube,
  FaLink,
  FaEnvelope,
  FaEyeSlash,
} from "react-icons/fa";
import { MdOutlineArrowCircleRight } from "react-icons/md";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Friendly errors
function mapFirebaseError(code = "", fallback = "Sign-in failed. Please try again.") {
  const c = String(code || "").toLowerCase();
  if (c.includes("invalid-email")) return "Please enter a valid email address.";
  if (c.includes("missing-password")) return "Please enter your password.";
  if (c.includes("invalid-credential")) return "Email or password is incorrect.";
  if (c.includes("wrong-password")) return "Incorrect password.";
  if (c.includes("user-not-found")) return "No account found with this email.";
  if (c.includes("user-disabled")) return "This account has been disabled.";
  if (c.includes("too-many-requests")) return "Too many attempts. Please wait and try again.";
  if (c.includes("network-request-failed")) return "Network error. Check your connection.";
  return fallback;
}

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 1) Sign in with Firebase (SDK builds correct REST payload)
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = cred?.user;

      // 2) If not verified, send verification and require verification first
      if (user && !user.emailVerified) {
        try {
          await sendEmailVerification(user);
          toast.success("Verification email sent. Check your inbox/spam.");
        } catch {
          toast.error("Couldn't send verification email. Please try again later.");
        }
        await signOut(auth);
        toast("Please verify your email to continue.", { icon: "✉️" });
        return;
      }

      // 3) Success
      toast.success("Login successful!");
      // navigate("/dashboard"); // optional redirect
    } catch (err) {
      // Show exact message/code to help you diagnose 400s
      const friendly = mapFirebaseError(err?.code || err?.message);
      toast.error(friendly);

      // Dev hint (visible in console): full payload
      // eslint-disable-next-line no-console
      console.debug("Firebase error:", { code: err?.code, message: err?.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const currentEmail = emailRef.current?.value || email || "";
    if (!currentEmail) {
      toast.error("Please enter your email first.");
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, currentEmail.trim());
      toast.success("Password reset email sent. Check your inbox/spam.");
    } catch (err) {
      toast.error(mapFirebaseError(err?.code || err?.message, "Couldn't send reset email."));
      console.debug("Reset error:", { code: err?.code, message: err?.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
                <span className="text-sm text-cyan-400 font-medium">Blockchain Portal</span>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form className="space-y-1" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="py-4">
              <label className="block mb-3 text-sm font-medium text-gray-300">Email Address</label>
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
                />
              </div>
            </div>

            {/* Password */}
            <div className="py-4">
              <label className="block mb-3 text-sm font-medium text-gray-300">Password</label>
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
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
                disabled={loading}
                className={`text-sm font-semibold hover:underline transition-colors ${
                  loading ? "text-slate-400 cursor-not-allowed" : "text-cyan-400 hover:text-cyan-300"
                }`}
              >
                Forgot password?
              </button>
            </div>

            {/* Sign in */}
            <button
              type="submit"
              disabled={loading}
              className={`group w-full font-semibold py-3 px-6 rounded-xl mb-6 transform transition-all duration-200 flex items-center justify-center
                ${
                  loading
                    ? "bg-slate-700 text-slate-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/25"
                }`}
            >
              <span className="mr-2">{loading ? "Signing in..." : "Access Blockchain"}</span>
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
                Your data is secured by blockchain technology with immutable records and cryptographic protection
              </p>
            </div>
          </div>
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-8 gap-2 h-full p-4">
              {Array.from({ length: 64 }, (_, i) => (
                <div key={i} className="bg-white rounded-sm animate-pulse" style={{ animationDelay: `${i * 50}ms` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
