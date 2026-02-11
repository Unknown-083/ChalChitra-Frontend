import Header from "../components/Header/Header.jsx";
import SideNav from "../components/Header/SideNav.jsx";
import Loading from "../components/Loading.jsx";

const MainLayout = ({ children, isLoading }) => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white overflow-x-hidden">
      {/* Fixed Header */}
      <Header />

      {/* Main content area */}
      <div className="flex pt-14 md:pt-[58px]">
        {/* Side Navigation */}
        <SideNav />

        {/* Page Content */}
        <main className="w-full lg:px-2 lg:ml-12 xl:ml-14 pb-20 lg:pb-6 overflow-hidden min-w-0">
          {isLoading ? (
            <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;