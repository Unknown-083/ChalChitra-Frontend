import { HomeIcon, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../utils/axios.js";
import { useDispatch } from "react-redux";
import { logout as authLogout } from "../../auth/authSlice";

const SideNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    axios
      .post("/api/v1/users/logout")
      .then((res) => {
        console.log("Logged out", res);
        dispatch(authLogout());
        navigate("/login");
      })
      .catch((err) => {
        console.error(
          "Logout error:",
          err.response ? err.response.data : err.message
        );
      });
  };

  const navItems = [
    {
      icon: <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: "Home",
      path: "/",
      onClick: () => navigate("/"),
      hoverColor: "hover:bg-[#272727]",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
          className="w-5 h-5 sm:w-6 sm:h-6"
        >
          <path d="M160-80q-33 0-56.5-23.5T80-160v-400q0-33 23.5-56.5T160-640h640q33 0 56.5 23.5T880-560v400q0 33-23.5 56.5T800-80H160Zm0-80h640v-400H160v400Zm240-40 240-160-240-160v320ZM160-680v-80h640v80H160Zm120-120v-80h400v80H280ZM160-160v-400 400Z" />
        </svg>
      ),
      label: "Subscriptions",
      path: "/subscriptions",
      onClick: () => navigate("/subscriptions"),
      hoverColor: "hover:bg-[#272727]",
    },
    {
      icon: <User className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: "Profile",
      path: "/profile",
      onClick: () => navigate("/profile"),
      hoverColor: "hover:bg-[#272727]",
    },
    {
      icon: <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: "Logout",
      path: null,
      onClick: handleLogout,
      hoverColor: "hover:bg-[#db0202] hover:border-[#db0202]",
    },
  ];

  return (
    <>
      {/* Desktop / Tablet */}
      <aside className="hidden lg:block fixed left-0 top-14 sm:top-16 md:top-[58px]
        h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] md:h-[calc(100vh-58px)]
        bg-[#0f0f0f] border-r border-[#272727]
        w-16 xl:w-18 overflow-y-auto scrollbar-hide z-40">
        <nav className="flex flex-col gap-4 xl:gap-5 pt-4 w-full px-1">
          {navItems.map((item, index) => {
            const isActive = item.path && location.pathname === item.path;

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-1 group cursor-pointer"
                onClick={item.onClick}
              >
                <div
                  className={`
                    rounded-full p-2.5 transition-all duration-200
                    ${
                      isActive
                        ? "bg-white text-black"
                        : `border border-[#272727] text-white ${item.hoverColor}`
                    }
                    group-hover:scale-105
                  `}
                >
                  {item.icon}
                </div>

                <p
                  className={`text-[10px] xl:text-xs text-center transition-colors max-w-full truncate px-1
                    ${
                      isActive
                        ? "text-white font-medium"
                        : "text-gray-400 group-hover:text-white"
                    }
                  `}
                >
                  {item.label}
                </p>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50
        bg-[#0f0f0f]/95 border-t border-[#272727]
        backdrop-blur-md safe-area-inset-bottom">
        <div className="flex justify-around items-center px-1 py-2">
          {navItems.map((item, index) => {
            const isActive = item.path && location.pathname === item.path;

            return (
              <button
                key={index}
                className="flex flex-col items-center gap-1 group min-w-0 flex-1 max-w-[100px]"
                onClick={item.onClick}
                aria-label={item.label}
              >
                <div
                  className={`
                    rounded-full p-2 transition-all duration-200
                    ${
                      isActive
                        ? "bg-white text-black"
                        : `border border-[#272727] text-white ${item.hoverColor}`
                    }
                    active:scale-95
                  `}
                >
                  {item.icon}
                </div>
                <span
                  className={`
                    text-[9px] text-center transition-colors truncate w-full px-1 sr-only
                    ${
                      isActive
                        ? "text-white font-medium"
                        : "text-gray-400"
                    }
                  `}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
};

export default SideNav;