import { useEffect, useState } from "react";
import Header from "../components/Header/Header.jsx";
import SideNav from "../components/Header/SideNav.jsx";
import { useSelector } from "react-redux";
import { toggleSubscribe } from "../utils/toggleLikeSubscribe.js";
import { useNavigate } from "react-router-dom";
import { fetchSubscriptions } from "../utils/getSubscriptions.js";

const AllSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscribedState, setSubscribedState] = useState({});
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptions({ id: user._id, setSubscriptions, setSubscribedState });
  }, [user._id]);

  const handleSubscribe = async (subscription) => {
    await toggleSubscribe({ channelId: subscription._id });
    setSubscribedState((prev) => ({
      ...prev,
      [subscription._id]: !prev[subscription._id],
    }));
  };

  return (
    <div className="min-h-screen text-white">
      <Header />

      <div className="flex">
        {/* Hide SideNav on mobile */}
        <SideNav/>

        <div className="w-full px-2 py-4 md:p-6 md:px-10 md:ml-15">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            All Subscriptions
          </h1>

          {subscriptions.map((subscription) => (
            <div
              key={subscription._id}
              className="
              w-full 
              bg-[#181818] 
              rounded-xl 
              p-3 
              mb-2
              flex items-center gap-3
              md:bg-transparent md:rounded-none md:p-0
              md:flex md:items-center md:justify-between"
            >
              {/* Left section */}
              <div className="flex items-center gap-3 flex-1">
                {/* Avatar */}
                <div
                  className="w-12 h-12 md:w-40 md:h-40 shrink-0 cursor-pointer"
                  onClick={() => navigate(`/channel/${subscription._id}`)}
                >
                  <img
                    src={subscription?.avatar?.url}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col">
                  <h2
                    className="text-sm md:text-xl font-medium cursor-pointer leading-tight"
                    onClick={() => navigate(`/channel/${subscription._id}`)}
                  >
                    {subscription.fullname}
                  </h2>

                  <span className="text-xs text-gray-400">
                    {subscription.subscribersCount || 0} subscribers
                  </span>
                </div>
              </div>

              {/* Button */}
              <button
                className={`text-xs md:text-base px-3 py-1.5 md:px-4 md:py-2 rounded-full font-medium transition-colors shrink-0 ${
                  subscribedState[subscription._id]
                    ? "border border-[#272727] text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => handleSubscribe(subscription)}
              >
                {subscribedState[subscription._id] ? "Subscribed" : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllSubscriptions;
