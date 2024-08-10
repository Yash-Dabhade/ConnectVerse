import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
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
        </div>
      </nav>
    </div>
  );
}

export default Header;
