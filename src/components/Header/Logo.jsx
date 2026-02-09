import React from "react";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center gap-1 cursor-pointer group"
      onClick={() => navigate("/")}
    >
      <img src="logo.png" alt="" className="object-cover w-13 rounded-lg" />
      <h3 className="text-xl font-bold">चलचित्र</h3>
    </div>
  );
};

export default Logo;
