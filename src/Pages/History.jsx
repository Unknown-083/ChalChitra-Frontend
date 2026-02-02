import React from "react";
import Header from "../components/Header/Header";
import Videos from "../components/Videos";
import { useSelector } from "react-redux";

const History = () => {
  const { watchHistory } = useSelector((state) => state.video);
  return (
    <div>
      <Header />
      <div className="p-2 px-5">
        <h2 className="text-3xl font-bold mb-3">Watch History</h2>
        <Videos videoArray={watchHistory} />
      </div>
    </div>
  );
};

export default History;
