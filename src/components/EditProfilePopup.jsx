import React from "react";
import Input from "./Input";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import axios from "../utils/axios.js";

const EditProfilePopup = ({ setEditProfilePopup }) => {
  const user = useSelector((state) => state.auth.userData);

  const [isLoading, setIsLoading] = React.useState(true);
  const [fullname, setFullname] = React.useState(user?.fullname || "");
  const [username, setUsername] = React.useState(user?.username || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [avatar, setAvatar] = React.useState();
  const [coverImage, setCoverImage] = React.useState();
  const [avatarPreview, setAvatarPreview] = React.useState(user?.avatar?.url || "");
  const [coverPreview, setCoverPreview] = React.useState(user?.coverImage?.url || "");

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    // sync local form state when user changes
    setFullname(user?.fullname || "");
    setUsername(user?.username || "");
    setEmail(user?.email || "");
    setAvatarPreview(user?.avatar?.url || "");
    setCoverPreview(user?.coverImage?.url || "");
  }, [user]);

  React.useEffect(() => {
    if (!avatar) return;
    const url = URL.createObjectURL(avatar);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatar]);

  React.useEffect(() => {
    if (!coverImage) return;
    const url = URL.createObjectURL(coverImage);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverImage]);

  const saveProfile = async () => {
    setIsLoading(true);
    try {
      const requests = [];

      if (
        fullname !== user?.fullname ||
        email !== user?.email ||
        username !== user?.username
      ) {
        requests.push(
          axios.patch("/api/v1/users/update-account", {
            fullname,
            email,
            username,
          })
        );
      }

      if (avatar) {
        const fd = new FormData();
        fd.append("avatar", avatar);
        requests.push(
          axios.patch("/api/v1/users/change-avatar", fd, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        );
      }

      if (coverImage) {
        const fd = new FormData();
        fd.append("coverImage", coverImage);
        requests.push(
          axios.patch("/api/v1/users/change-coverImage", fd, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        );
      }

      if (requests.length > 0) {
        const results = await Promise.all(requests);
        console.log("Profile update results:", results);
      }

      setEditProfilePopup(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="top-7 z-20 backdrop-blur-xs fixed inset-0 bg-opacity-50 flex items-center justify-center">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-4 bg-[#0f0f0f] border border-[#272727] p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <Input
            label="Name"
            placeholder="Enter your name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            flexCol={false}
            classname="w-full border-[#272727] focus:border-white focus:ring-0"
          />
          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            flexCol={false}
            classname="w-full border-[#272727] focus:border-white focus:ring-0"
          />
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            flexCol={false}
            classname="w-full border-[#272727] focus:border-white focus:ring-0"
          />
          <div className="flex">
            <Input
              type="file"
              label="Profile Picture"
              onChange={(e) => setAvatar(e.target.files[0])}
              flexCol={false}
              classname="w-full border-[#272727] focus:border-white focus:ring-0"
            />
            <img
              src={avatarPreview}
              alt={user?.fullname}
              className="w-16 h-16 rounded-full object-cover ml-4"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
          <div className="flex">
            <Input
              type="file"
              label="Cover Image"
              onChange={(e) => setCoverImage(e.target.files[0])}
              flexCol={false}
              classname="w-full border-[#272727] focus:border-white focus:ring-0"
            />
            <img
              src={coverPreview}
              alt={user?.fullname}
              className="w-24 h-16 rounded-md object-cover ml-4"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
          <div className="flex justify-center gap-2">
            <button
              className="px-4 py-1.5 border bg-white text-black rounded-full"
              onClick={saveProfile}
            >
              Save
            </button>
            <button
              className="px-4 py-1.5 border border-[#272727] hover:bg-[#272727] rounded-full"
              onClick={() => setEditProfilePopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePopup;
