import React, { useState, useRef } from "react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import { AlertCircle, Upload, X, Image as ImageIcon } from "lucide-react";

const Signup = () => {
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  
  const avatarRef = useRef();
  const coverImageRef = useRef();
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (avatarRef.current) avatarRef.current.value = null;
  };

  const removeCover = () => {
    setCoverImage(null);
    setCoverPreview(null);
    if (coverImageRef.current) coverImageRef.current.value = null;
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!username.trim()) {
      setError("Username is required");
      return false;
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!avatar) {
      setError("Avatar is required");
      return false;
    }
    return true;
  };

  const signup = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullname", fullName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatar", avatar);
      
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      await axios.post("/api/v1/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form
      setAvatar(null);
      setCoverImage(null);
      setAvatarPreview(null);
      setCoverPreview(null);
      setEmail("");
      setUsername("");
      setFullName("");
      setPassword("");
      if (avatarRef.current) avatarRef.current.value = null;
      if (coverImageRef.current) coverImageRef.current.value = null;

      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      
      if (error.response) {
        setError(error.response.data?.message || "Signup failed. Please try again.");
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
      <form onSubmit={signup} className="w-full">
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto p-8 bg-[#0f0f0f] border border-[#272727] rounded-xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400 text-sm">Join us and get started today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <Input
              placeholder="Full name *"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setError("");
              }}
              disabled={isLoading}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Username *"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                disabled={isLoading}
                required
              />
              <Input
                type="email"
                placeholder="Email address *"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                disabled={isLoading}
                required
              />
            </div>

            <Input
              type="password"
              placeholder="Password (min 6 characters) *"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              disabled={isLoading}
              required
            />

            {/* File Upload Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Avatar Upload */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-medium">
                  Avatar * (Profile Picture)
                </label>
                {!avatarPreview ? (
                  <div
                    onClick={() => !isLoading && avatarRef.current?.click()}
                    className="border-2 border-dashed border-[#272727] rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 hover:bg-[#1a1a1a] transition-all"
                  >
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Click to upload</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 2MB)</p>
                  </div>
                ) : (
                  <div className="relative bg-[#1a1a1a] rounded-lg p-3">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeAvatar}
                      disabled={isLoading}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-all disabled:opacity-50"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={avatarRef}
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isLoading}
                  className="hidden"
                />
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-medium">
                  Cover Image (Optional)
                </label>
                {!coverPreview ? (
                  <div
                    onClick={() => !isLoading && coverImageRef.current?.click()}
                    className="border-2 border-dashed border-[#272727] rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 hover:bg-[#1a1a1a] transition-all"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Click to upload</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 2MB)</p>
                  </div>
                ) : (
                  <div className="relative bg-[#1a1a1a] rounded-lg p-3">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeCover}
                      disabled={isLoading}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-all disabled:opacity-50"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={coverImageRef}
                  accept="image/*"
                  onChange={handleCoverChange}
                  disabled={isLoading}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 mt-6 bg-white hover:bg-gray-200 active:bg-gray-300 text-black font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Login Link */}
          <div className="pt-4 border-t border-[#272727]">
            <p className="text-sm text-gray-400 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white hover:text-gray-300 underline font-medium transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;