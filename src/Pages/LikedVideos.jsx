import Videos from '../components/Videos';
import { useSelector } from 'react-redux';
import MainLayout from '../layout/MainLayout';

const LikedVideos = () => {
  const { likedVideos } = useSelector((state) => state.video);
  return (
    <MainLayout>
      <div className="pt-3 md:px-5">
        <h2 className="text-3xl font-bold mb-3 px-3 md:px-0">Liked Videos</h2>
        <Videos videoArray={likedVideos} />
      </div>
    </MainLayout>
  );
}

export default LikedVideos
