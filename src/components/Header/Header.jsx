import React, { useState } from "react";
import { Menu, Play, Search, Upload, Bell } from "lucide-react";
import Input from "../Input";
import { useNavigate } from "react-router-dom";
import SideNavPopUp from "./SideNavPopUp";
import Logo from "./Logo";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sideNavPopupOpen, setSideNavPopupOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50 ">
      {sideNavPopupOpen && (
        <SideNavPopUp closeSideNav={() => setSideNavPopupOpen(false)} />
      )}
      <div className="flex items-center gap-5">
        <Menu
          className="w-6 h-6 font-extralight cursor-pointer hover:text-gray-300 transition-colors"
          onClick={() => setSideNavPopupOpen(!sideNavPopupOpen)}
        />
        <Logo/>
      </div>

      <div className="flex-1 max-w-2xl mx-8 cursor-pointer">
        <div className="relative">
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2  hover:bg-[#272727] p-3 px-4 rounded-x-full rounded-r-full transition-colors border border-[#272727]">
            <Search className="w-5 h-4 text-[#EEEEEE] cursor-pointer" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="flex items-center gap-2 border border-[#272727] text-[#EEF0E5] px-4 py-2 cursor-pointer rounded-full transition-all transform hover:scale-105"
          onClick={() => navigate("/upload")}
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Create</span>
        </button>
        <Bell className="w-6 h-6 cursor-pointer text-[#EEEEEE] hover:text-gray-300 transition-colors" />
      </div>
    </header>
  );
};

export default Header;
