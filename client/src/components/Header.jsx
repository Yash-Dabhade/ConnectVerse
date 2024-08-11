import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
  const handleLogOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/login";
  };
  return (
    <div className="w-full z-10">
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <NavLink
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src="./assets/logo.png" className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              ConnectVerse
            </span>
          </NavLink>
          {(window.sessionStorage.getItem("email") ||
            window.localStorage.getItem("email")) && (
            <div>
              <button
                type="button"
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2 text-center"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
