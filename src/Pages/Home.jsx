import { useRef, useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout.jsx";
import Videos from "../components/Videos.jsx";
import { useSelector } from "react-redux";

const Homepage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const videos = useSelector((state) => state.video.videos);

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

  useEffect(() => {
    // Check if videos are loaded
    if (videos !== null && videos !== undefined) {
      setIsLoading(false);
    }
  }, [videos]);

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
    <MainLayout isLoading={isLoading}>
      <div className="font-sans">
        {/* Category Navigation - Fixed on Desktop, Sticky on Mobile */}
        <nav 
          className="lg:fixed sm:top-16 md:top-[65px] 
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
                  text-sm 
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
        <main className="sm:px-4 md:px-5 lg:px-6 xl:px-8 
                        sm:pt-6 lg:pt-[78px]
                        pb-20 lg:pb-8
                        w-full max-w-[2000px] mx-auto">
          <Videos activeCategory={activeCategory} />
        </main>

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
    </MainLayout>
  );
};

export default Homepage;