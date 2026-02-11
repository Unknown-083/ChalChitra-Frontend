import Videos from "../components/Videos";
import { useSelector } from "react-redux";
import MainLayout from "../layout/MainLayout";

const History = () => {
  const { watchHistory } = useSelector((state) => state.video);
  return (
    <MainLayout>
      <div className="pt-3 md:px-5">
        <h2 className="text-3xl font-bold mb-3 md:px-0 px-3">Watch History</h2>
        <Videos videoArray={watchHistory} />
      </div>
    </MainLayout>
  );
};

export default History;
