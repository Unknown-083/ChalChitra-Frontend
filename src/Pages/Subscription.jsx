import React, { useEffect } from "react";
import Header from "../components/Header/Header.jsx";
import SideNav from "../components/Header/SideNav.jsx";
import Videos from "../components/Videos.jsx";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import { formatVideoData } from "../utils/helpers.js";
import MainLayout from "../layout/MainLayout.jsx";

const Subscription = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchSubscriptionVideos = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/subscriptions/get-subscription-videos`
        );
        
        data?.data && setVideos(data.data.map(formatVideoData));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching subscription videos:", error);
      }
    };
    fetchSubscriptionVideos();
  }, []);

  return (
    <MainLayout isLoading={isLoading}>
      <Header />

      <div className="flex w-full">
        {/* Hide SideNav on small screens */}
        <SideNav/>

        <div className="w-full py-4 md:p-6">
          {/* Title */}
          <h1 className="text-2xl px-2 md:text-3xl font-bold mb-3">
            Subscription
          </h1>

          {/* Header Row */}
          <div className="flex px-2 sm:flex-row items-center justify-between gap-2 mb-4">
            <h2 className="text-lg md:text-xl text-gray-400">
              Latest Videos
            </h2>

            <h2
              className="text-sm md:text-md text-blue-400 cursor-pointer hover:text-blue-500 self-start sm:self-auto"
              onClick={() => navigate("/all-subscriptions")}
            >
              Manage
            </h2>
          </div>

          {/* Videos */}
          <Videos videoArray={videos} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Subscription;
