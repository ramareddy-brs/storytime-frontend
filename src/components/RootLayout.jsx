import { Outlet } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setStoryInfo, toggleSidebar } from "../store/user/authSlice";
import Sidebar from "react-sidebar";
import SidebarPlayer from "./sidebar/SidebarPlayer";

const RootLayout = () => {
  const dispatch = useDispatch()
  const { isLoggedIn, isSidebarOpen} = useSelector((state) => state.auth);

  const showSidebar = () => {
    dispatch(setStoryInfo({ s_id: null, s_name: null }));
    dispatch(toggleSidebar());
  };

  return (
    <>
      {isLoggedIn && <NavigationBar />}
      <ToastContainer limit={1} />
      <Outlet />
      {isSidebarOpen && (
        <Sidebar
          transitions={true}
          sidebar={<SidebarPlayer />}
          children={<>Test</>}
          open={isSidebarOpen}
          pullRight={true}
          onSetOpen={showSidebar}
          sidebarClassName={"shadow-none fixed z-40"}
        ></Sidebar>
      )}
    </>
  );
};

export default RootLayout;
