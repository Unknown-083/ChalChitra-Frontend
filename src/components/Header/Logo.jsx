import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "/logo.png"

const Logo = ({ compact = false }) => {
  const navigate = useNavigate();
  
  return (
    <div
      className="flex items-center gap-2.5 cursor-pointer group"
      onClick={() => navigate("/")}
    >
      <img 
        src={logo} 
        alt="चलचित्र" 
        className={`object-contain brightness-100 group-hover:brightness-110 
                    transition-all duration-200
                    ${compact ? 'h-7' : 'h-8 sm:h-9 md:h-10'}`}
      />
      {!compact && (
        <h3 className="text-xl sm:text-2xl font-bold text-white 
                       tracking-tight whitespace-nowrap
                       transition-opacity group-hover:opacity-80">
          चलचित्र
        </h3>
      )}
    </div>
  );
};

export default Logo;