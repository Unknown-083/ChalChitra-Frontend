import { useState, useEffect, useRef } from "react";
import { Menu, Search, Upload, Bell, X } from "lucide-react";
import Input from "../Input";
import { useNavigate } from "react-router-dom";
import SideNavPopUp from "./SideNavPopUp";
import Logo from "./Logo";

const Header = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sideNavPopupOpen, setSideNavPopupOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY =
            window.pageYOffset || document.documentElement.scrollTop;

          // Only hide/show on mobile and tablet, always visible on desktop
          if (window.innerWidth < 1024) {
            if (currentScrollY < 50) {
              setIsVisible(true);
            } else if (currentScrollY > lastScrollY.current) {
              setIsVisible(false);
            } else {
              setIsVisible(true);
            }
          } else {
            // Always visible on desktop
            setIsVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleMenuClick = () => {
    setSideNavPopupOpen(!sideNavPopupOpen);
    onMenuClick?.();
  };

  return (
    <>
      <header
        className={`backdrop-blur-md bg-[#0f0f0f]/95 px-3 sm:px-4 md:px-6 py-3 
                 flex items-center justify-between fixed top-0 left-0 right-0 z-50 
                 border-b border-[#272727] w-full overflow-hidden
                 transition-transform duration-300 ease-in-out
                 ${isVisible ? "translate-y-0" : "-translate-y-full lg:translate-y-0"}`}
      >
        {/* Mobile Search Overlay */}
        {mobileSearchOpen && (
          <div className="fixed inset-0 bg-[#0f0f0f] z-50 flex items-start pt-3 px-3 lg:hidden">
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 mr-2 hover:bg-[#272727] rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex-1 relative min-w-0">
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 
                             hover:bg-[#272727] p-3 px-4 rounded-r-full transition-colors 
                             border border-[#272727]"
              >
                <Search className="w-5 h-4 text-[#EEEEEE]" />
              </button>
            </div>
          </div>
        )}

        {/* Left Section - Logo */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0 flex-shrink-0">
          <Menu
            className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 cursor-pointer 
                     hover:text-gray-300 transition-colors"
            onClick={handleMenuClick}
          />
          {/* Mobile - Compact logo (icon only) */}
          <div className="block sm:hidden flex-shrink-0">
            <Logo compact />
          </div>
          {/* Tablet & Desktop - Full logo with text */}
          <div className="hidden sm:block flex-shrink-0">
            <Logo />
          </div>
        </div>

        {/* Center Section - Search (Desktop & Tablet) */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-4 xl:mx-8 min-w-0">
          <div className="relative w-full">
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 
                           hover:bg-[#272727] p-3 px-4 rounded-r-full transition-colors 
                           border border-[#272727]"
            >
              <Search className="w-5 h-4 text-[#EEEEEE] cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
          {/* Mobile Search Icon */}
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="lg:hidden p-2 hover:bg-[#272727] rounded-full transition-colors"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Upload/Create Button */}
          <button
            className="flex items-center gap-1.5 sm:gap-2 border border-[#272727] 
                     text-[#EEF0E5] px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 
                     cursor-pointer rounded-full transition-all transform 
                     hover:scale-105 hover:bg-[#272727] whitespace-nowrap"
            onClick={() => navigate("/upload")}
          >
            <Upload className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="hidden sm:inline text-sm md:text-base">
              Create
            </span>
          </button>

          {/* Notifications Bell */}
          <button className="p-2 hover:bg-[#272727] rounded-full transition-colors hidden sm:block">
            <Bell className="w-5 h-5 md:w-6 md:h-6 text-[#EEEEEE]" />
          </button>

          {/* Mobile - Bell icon smaller */}
          <button className="p-1.5 hover:bg-[#272727] rounded-full transition-colors sm:hidden">
            <Bell className="w-5 h-5 text-[#EEEEEE]" />
          </button>
        </div>
      </header>

      {sideNavPopupOpen && (
        <SideNavPopUp closeSideNav={() => setSideNavPopupOpen(false)} />
      )}
    </>
  );
};

export default Header;
