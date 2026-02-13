import React from "react";

const Loading = ({ inline = false, className = "" }) => {
  const base = inline
    ? "flex justify-center items-center gap-4"
    : "h-screen flex justify-center items-center gap-4";

  return (
    <div className={`${base} ${className}`.trim()}>
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping" />
        <div className="absolute inset-0 bg-purple-600 rounded-full" />
      </div>
      <div className="relative w-16 h-16" style={{ animationDelay: "0.2s" }}>
        <div
          className="absolute inset-0 bg-pink-500 rounded-full animate-ping"
          style={{ animationDelay: "0.2s" }}
        />
        <div className="absolute inset-0 bg-pink-600 rounded-full" />
      </div>
      <div className="relative w-16 h-16">
        <div
          className="absolute inset-0 bg-cyan-500 rounded-full animate-ping"
          style={{ animationDelay: "0.4s" }}
        />
        <div className="absolute inset-0 bg-cyan-600 rounded-full" />
      </div>
    </div>
  );
};

export default Loading;
