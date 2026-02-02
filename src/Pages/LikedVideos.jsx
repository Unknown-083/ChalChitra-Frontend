import React from 'react'
import Header from '../components/Header/Header';
import Videos from '../components/Videos';
import { useSelector } from 'react-redux';

const LikedVideos = () => {
  const { LikedVideos } = useSelector((state) => state.video);
  return (
    <div>
      <Header />
      <div className="p-2 px-5">
        <h2 className="text-3xl font-bold mb-3">Liked Videos</h2>
        <Videos videoArray={LikedVideos} />
      </div>
    </div>
  );
}

export default LikedVideos
