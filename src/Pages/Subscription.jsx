import React, { useEffect } from "react";
import Header from "../components/Header/Header.jsx";
import SideNav from "../components/Header/SideNav.jsx";
import Videos from "../components/Videos.jsx";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import { formatVideoData } from "../utils/helpers.js";

const Subscription = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = React.useState([]);

  useEffect(() => {
    const fetchSubscriptionVideos = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/subscriptions/get-subscription-videos`,
        );
        
        data.data && setVideos(data.data.map(formatVideoData));
      } catch (error) {
        console.error("Error fetching subscription videos:", error);
      }
    };
    fetchSubscriptionVideos();
  }, []);

  return (
    <div className="min-h-screen text-white">
      <Header />
      <div className="flex w-full">
        <SideNav />
        <div className="p-6 ml-15 w-full">
          <h1 className="text-3xl font-bold mb-4">Subscription</h1>
          <div className="flex justify-between mb-4 w-full">
            <h2 className="text-xl text-gray-400">Latest Videos</h2>
            <h2
              className="text-md text-blue-400 cursor-pointer hover:text-blue-500"
              onClick={() => navigate("/all-subscriptions")}
            >
              Manage
            </h2>
          </div>
          <Videos videoArray={videos}/>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
