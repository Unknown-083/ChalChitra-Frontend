import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "/logo.png"

const Logo = ({ compact = false, classname = "" }) => {
  const navigate = useNavigate();
  
  return (
    <div
      className={`flex items-center gap-2.5 cursor-pointer group `}
      onClick={() => navigate("/")}
    >
      <img 
        src={logo} 
        alt="चलचित्र" 
        className={`object-contain scale-120 brightness-100 group-hover:brightness-110 
                    transition-all duration-200 ${classname}
                    ${compact ? 'h-7' : 'h-8 sm:h-9 md:h-10'}`}
      />
    </div>
  );
};

export default Logo;