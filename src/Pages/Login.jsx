import React, { useState } from "react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import { login as authLogin } from "../auth/authSlice";
import { useDispatch } from "react-redux";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    
    // Validation
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username/email and password");
      return;
    }

    setIsLoading(true);

    try {
      const isEmail = username.includes("@");

      const response = await axios.post("/api/v1/users/login", {
        ...(isEmail ? { email: username } : { username }),
        password,
      });
      
      // Store tokens if your backend sends them
      if (response.data.data.accessToken) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
      }
      if (response.data.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
      }

      // Dispatch login action
      dispatch(authLogin(response.data.data.loggedInUser));

      // Reset form fields
      setUsername("");
      setPassword("");

      // Redirect to home
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      
      // Set user-friendly error message
      if (error.response) {
        setError(error.response.data?.message || "Invalid credentials");
      } else if (error.request) {
        setError("Cannot connect to server. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-black">
      <form onSubmit={login} className="w-full">
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto p-8 bg-[#0f0f0f] border border-[#272727] rounded-xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-500 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
          
          {/* Form Fields */}
          <div className="space-y-4">
            <Input
              placeholder="Email or username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(""); // Clear error when user types
              }}
              disabled={isLoading}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(""); // Clear error when user types
              }}
              disabled={isLoading}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-white hover:bg-gray-200 active:bg-gray-300 text-black font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        
          {/* Signup Link */}
          <div className="pt-4 border-t border-[#272727]">
            <p className="text-sm text-gray-400 text-center">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-white hover:text-gray-300 underline font-medium transition-colors duration-200"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;