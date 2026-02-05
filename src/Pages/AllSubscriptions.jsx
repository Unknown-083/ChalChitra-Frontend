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
    // Toggle the subscription status for this specific subscription
    setSubscribedState((prev) => ({
      ...prev,
      [subscription._id]: !prev[subscription._id],
    }));
  };

  return (
    <div className="min-h-screen text-white">
      <Header />
      <div className="flex">
        <SideNav />
        <div className="p-6 px-10 ml-15 w-full">
          <h1 className="text-3xl font-bold text-white mb-4">
            All Subscriptions
          </h1>

          {subscriptions.map((subscription) => (
            <div
              key={subscription._id}
              className="w-full flex items-center justify-between mb-4"
            >
              <div className="rounded-full min-w-40 h-40 content-center cursor-pointer">
                <img
                  src={subscription?.avatar?.url}
                  alt="avatar"
                  className="w-full h-full rounded-full"
                  onClick={() => navigate(`/channel/${subscription._id}`)}
                />
              </div>

              <div className="w-full pl-4">
                <h2
                  className="text-xl mb-3 cursor-pointer"
                  onClick={() => navigate(`/channel/${subscription._id}`)}
                >
                  {subscription.fullname}
                </h2>
                <div className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                  <span>{subscription.username}</span>
                  <span>•</span>
                  <span>{subscription.subscribersCount || 0} subscribers</span>
                </div>
              </div>
              <div>
                <button
                  className={`w-27 flex items-center justify-center px-4 py-2 rounded-full font-medium transition-colors ${
                    subscribedState[subscription._id]
                      ? "border-[#272727] border text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={() => handleSubscribe(subscription)}
                >
                  {subscribedState[subscription._id]
                    ? "Subscribed"
                    : "Subscribe"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllSubscriptions;
