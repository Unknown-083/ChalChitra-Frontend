import React from "react";
import Header from "../components/Header/Header.jsx";
import SideNav from "../components/Header/SideNav.jsx";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen text-white ">
      {/* Fixed Header */}
      <Header />

      {/* Main content area */}
      <div className="flex pt-14 md:pt-[58px]">
        {/* Side Navigation */}
        <SideNav />

        {/* Page Content */}
        <main className="w-full lg:px-2 lg:ml-12 mb-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
