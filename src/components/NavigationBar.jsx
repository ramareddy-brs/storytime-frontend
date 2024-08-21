// Navigation component 
import { NavLink, useNavigate } from "react-router-dom";
import "../App.css";
import { logout } from "../store/user/authSlice";
import { useDispatch, useSelector } from "react-redux";

const NavigationBar = () => {
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };
  return (
    <nav className="bg-brandColor fixed w-full mt-0 top-0 z-10 px-5">
      <div className="container mx-auto">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>

              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>

              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <a href="/">
                <img
                  className="block lg:hidden h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=500"
                  alt="Workflow"
                />
                <img
                  className="hidden lg:block h-8 w-auto mr-2"
                  src="/images/logo.svg"
                  alt="Workflow"
                />
              </a>
              StoryTime
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4 items-center leading-loose px-4">
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    isActive ? "border-b border-b-3 px-4" : "px-3"
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    isActive ? "border-b border-b-3 px-4" : "px-3"
                  }
                >
                  Categories
                </NavLink>
                <NavLink
                  to="/authors"
                  className={({ isActive }) =>
                    isActive ? "border-b border-b-3 px-4" : "px-3"
                  }
                >
                  Authors
                </NavLink>
                <NavLink
                  to="/library"
                  className={({ isActive }) =>
                    isActive ? "border-b border-b-3 px-4" : "px-3"
                  }
                >
                  Library
                </NavLink>
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <ul className="menu">
              <li className="dropdown dropdown-6 relative">
                {userData && <p className="text-white pr-2">Welcome back {userData.first_name}</p>}
                <NavLink to="/profile" className="flex items-center">
                  Profile
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </NavLink>
                <ul className="dropdown_menu dropdown_menu--animated dropdown_menu-6">
                  <li className="dropdown_item-2 rounded-t-xl">
                    <NavLink to="/profile">Account</NavLink>
                  </li>
                  <li className="dropdown_item-1 rounded-b-xl">
                    <button onClick={logoutHandler}>Logout</button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
