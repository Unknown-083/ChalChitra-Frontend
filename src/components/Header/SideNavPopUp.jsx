import React, { use, useEffect, useState } from "react";
import {
  X,
  Home,
  Flame,
  PlaySquare,
  Clock,
  ThumbsUp,
  User,
  History,
} from "lucide-react";
import Logo from "./Logo";
import { useSelector } from "react-redux";
import { fetchSubscriptions } from "../../utils/getSubscriptions.js";
import { useNavigate } from "react-router-dom";

const SideNavPopUp = ({ closeSideNav }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const user = useSelector((state) => state.auth.userData);
  const { watchLater } = useSelector((state) => state.video);
  const navigate = useNavigate();

  useEffect(() => {
    const getSubscriptions = async () => {
      // Fetch subscriptions if needed
      fetchSubscriptions({ id: user._id, setSubscriptions });
      // Handle the fetched data as needed
    };
    getSubscriptions();
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(closeSideNav, 300);
  };

  const NavItem = ({ icon: Icon, label, onClick }) => (
    <button
      className="flex items-center gap-5 px-3 py-2 rounded-lg hover:bg-[#272727] transition-colors"
      onClick={onClick}
    >
      <Icon className="w-6 h-6" />
      <span className="text-md">{label}</span>
    </button>
  );

  const SubscriptionItem = ({ name, onClick }) => (
    <button
      className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-[#272727] transition-colors"
      onClick={onClick}
    >
      <img
        className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00ADB5] to-[#393E46]"
        src={name.avatar?.url}
      />
      <span className="text-md truncate">{name.fullname}</span>
    </button>
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />

      {/* Side Nav */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#0f0f0f] z-50
          ${isClosing ? "animate-slide-out" : "animate-slide-in"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#272727]">
          <Logo />
          <X
            className="w-6 h-6 cursor-pointer hover:text-gray-300"
            onClick={handleClose}
          />
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar px-4 py-4 space-y-6">
          {/* Main */}
          <div className="space-y-1">
            <NavItem
              icon={Home}
              label="Home"
              onClick={() => {
                navigate("/");
                closeSideNav();
              }}
            />
            <NavItem
              icon={Flame}
              label="Trending"
              onClick={() => {
                navigate("/");
                closeSideNav();
              }}
            />
          </div>

          <hr className="border-[#272727]" />

          {/* Subscriptions */}
          <div className="space-y-1">
            <p
              className="text-sm uppercase text-gray-400 hover:text-gray-300 cursor-pointer px-3 mb-2"
              onClick={() => navigate("/subscriptions")}
            >
              Subscriptions
            </p>

            {subscriptions.length === 0 && (
              <p className="text-sm text-gray-400 px-3">
                No subscriptions found.
              </p>
            )}
            {subscriptions.map((sub) => (
              <SubscriptionItem
                key={sub._id}
                name={sub}
                onClick={() => {
                  navigate(`/channel/${sub._id}`);
                  closeSideNav();
                }}
              />
            ))}
          </div>

          <hr className="border-[#272727]" />

          {/* You */}
          <div className="space-y-1">
            <p
              className="text-sm uppercase text-gray-400 hover:text-gray-300 cursor-pointer px-3 mb-2"
              onClick={() => navigate("/profile")}
            >
              You
            </p>
            <NavItem
              icon={User}
              label="Your Channel"
              onClick={() => {
                navigate(`/channel/${user._id}`);
                closeSideNav();
              }}
            />
            <NavItem
              icon={History}
              label="History"
              onClick={() => {
                navigate("/history");
                closeSideNav();
              }}
            />
            <NavItem
              icon={Clock}
              label="Watch Later"
              onClick={() => {
                navigate(`/playlists/${watchLater.id}`);
                closeSideNav();
              }}
            />
            <NavItem
              icon={ThumbsUp}
              label="Liked Videos"
              onClick={() => {
                navigate("/liked-videos");
                closeSideNav();
              }}
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideNavPopUp;
