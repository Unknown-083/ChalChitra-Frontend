import { useRef, useState } from "react";
import Header from "../components/Header/Header.jsx";
import SideNav from "../components/Header/SideNav.jsx";
import Videos from "../components/Videos.jsx";

const Homepage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    'Music',
    'Gaming',
    'Sports',
    'News',
    'Entertainment',
    'Education',
    'Technology',
    'Science',
    'Travel',
    'Cooking',
    'Fitness',
    'Fashion',
    'Comedy',
    'Documentary'
  ];

  const scrollRef = useRef(null);
  const animationRef = useRef(null);

  const handleMouseMove = (e) => {
    const container = scrollRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const scroll = () => {
      if (!scrollRef.current) return;
      
      if (x > width * 0.85) {
        scrollRef.current.scrollLeft += 5;
        animationRef.current = requestAnimationFrame(scroll);
      } else if (x < width * 0.15) {
        scrollRef.current.scrollLeft -= 5;
        animationRef.current = requestAnimationFrame(scroll);
      }
    };

    scroll();
  };

  const handleMouseLeave = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };
  
  return (
    <div className="font-sans min-h-screen text-white bg-[#0f0f0f] overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* SideNav */}
      <SideNav />

      {/* Main Container */}
      <div className="pt-14 sm:pt-16 md:pt-[70px] lg:pl-18">
        {/* Category Navigation - Fixed on Desktop, Sticky on Mobile */}
        <nav 
          className="sticky lg:fixed top-14 sm:top-16  
                     left-0 lg:left-16 xl:left-18 right-0 z-30
                     bg-[#0f0f0f] border-b border-[#272727]
                     px-3 sm:px-4 md:px-6 py-3"
          onMouseMove={handleMouseMove} 
          onMouseLeave={handleMouseLeave}
        >
          <div 
            ref={scrollRef} 
            className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide
                       scroll-smooth"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  px-3 sm:px-4 py-1 sm:py-2 
                  rounded-lg sm:rounded-xl 
                  text-xs sm:text-sm 
                  font-medium transition-all 
                  whitespace-nowrap flex-shrink-0
                  ${
                    activeCategory === category
                      ? "bg-white text-black"
                      : "bg-[#272727] text-gray-300 hover:bg-[#3f3f3f] hover:text-white"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="sm:px-4 md:px-5 lg:px-3 
                        pt-5 sm:pt-6 lg:pt-[70px]
                        pb-20 lg:pb-8
                        w-full max-w-[2000px] mx-auto">
          <Videos activeCategory={activeCategory} />
        </main>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Homepage;