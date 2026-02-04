import React from "react";
import { HomeIcon, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios.js";
import { useDispatch } from "react-redux";
import { logout as authLogout } from "../../auth/authSlice";

const SideNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hangleLogout = () => {
    // Clear user data from local storage or cookies
    axios.post("/api/v1/users/logout")
    .then((res) => {
      console.log("Logged out", res);
      dispatch(authLogout());
      navigate("/login");
    })
    .catch((err) => {
      console.error("Logout error:", err.response ? err.response.data : err.message);
    });
  }
  return (
    <div className="fixed min-h-screen min-w-15 p-2 flex flex-col gap-5">
      {/* <h1>sidenav</h1> */}
      <div className="flex flex-col items-center gap-0.5" onClick={() => navigate("/")}>
        <div className="rounded-full border border-[#272727] mx-auto hover:bg-[#272727] p-3 cursor-pointer content-center">
          <HomeIcon />
        </div>
        <p className="text-[10px]">Home</p>
      </div>

      <div className="flex flex-col items-center gap-0.5" onClick={() => navigate("/subscriptions")}>
        <div className="rounded-full border border-[#272727] mx-auto hover:bg-[#272727] p-3 cursor-pointer content-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e3e3e3"
          >
            <path d="M160-80q-33 0-56.5-23.5T80-160v-400q0-33 23.5-56.5T160-640h640q33 0 56.5 23.5T880-560v400q0 33-23.5 56.5T800-80H160Zm0-80h640v-400H160v400Zm240-40 240-160-240-160v320ZM160-680v-80h640v80H160Zm120-120v-80h400v80H280ZM160-160v-400 400Z" />
          </svg>
        </div>
        <p className="text-[10px]">Subscriptions</p>
      </div>

      <div className="flex flex-col items-center gap-0.5" onClick={() => navigate("/profile")}>
        <div className="rounded-full border border-[#272727] mx-auto hover:bg-[#272727] p-3 cursor-pointer content-center">
          <User />
        </div>
        <p className="text-[10px]">Profile</p>
      </div>

      <div className="flex flex-col items-center gap-0.5" onClick={hangleLogout}>
        <div className="rounded-full border border-[#272727] mx-auto hover:bg-[#db0202] hover:border-[#db0202] p-3 cursor-pointer content-center">
          <LogOut />
        </div>
        <p className="text-[10px]">Logout</p>
      </div>
    </div>
  );
};

export default SideNav;
