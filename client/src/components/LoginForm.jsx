import React, { useState } from "react";
import api from "../api/api.js";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants.js";
import { Navigate, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleToastError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      handleToastError("All fields are compulsary");
      return;
    }

    api
      .post("/login", {
        email,
        password,
      })
      .then((res) => {
        if (res.data.statusCode == 200) {
          if (remember) {
            localStorage.setItem("email", res.data.data?.user?.email);
            localStorage.setItem(ACCESS_TOKEN, res.data.data.accessToken);
            localStorage.setItem(REFRESH_TOKEN, res.data.data.refreshToken);
          } else {
            sessionStorage.setItem("email", res.data.data?.user?.email);
            sessionStorage.setItem(ACCESS_TOKEN, res.data.data.accessToken);
            sessionStorage.setItem(REFRESH_TOKEN, res.data.data.refreshToken);
          }
          //redirect to the home page
          window.location.href = "/";
        } else {
          handleToastError(res.data.message);
        }
      })
      .catch((err) => {
        handleToastError("Unable to register at this time ! Try again later");
      });
  };

  return (
    <div className="w-[500px] font-semibold bg-gray-50 flex items-center md:h-screen p-4">
      <div className="w-full max-w-4xl max-md:max-w-xl mx-auto">
        <div className="bg-white flex items-center justify-center h-1/2 sm:p-8 p-6 shadow-md rounded-md overflow-hidden">
          <div
            className="rounded-xl max-md:order-1 space-y-6"
            style={{
              backgroundImage: "url('./assets/globe.jpg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></div>

          <form className="w-full" onSubmit={handleLogin}>
            <div className="mb-8">
              <h3 className="text-blue-950 text-2xl font-bold">
                Welcome back to ConnectVerse
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Email Id
                </label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                    className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                    placeholder="Enter email"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-4"
                    viewBox="0 0 682.667 682.667"
                  >
                    <defs>
                      <clipPath id="a" clipPathUnits="userSpaceOnUse">
                        <path
                          d="M0 512h512V0H0Z"
                          data-original="#000000"
                        ></path>
                      </clipPath>
                    </defs>
                    <g
                      clipPath="url(#a)"
                      transform="matrix(1.33 0 0 -1.33 0 682.667)"
                    >
                      <path
                        fill="none"
                        strokeMiterlimit="10"
                        strokeWidth="40"
                        d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    required
                    className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                    placeholder="Enter password"
                  />
                  <svg
                    onClick={(e) => {
                      setShowPassword(!showPassword);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-4 cursor-pointer"
                    viewBox="0 0 128 128"
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  value={remember}
                  onChange={(e) => {
                    setRemember(e.target.checked);
                  }}
                  type="checkbox"
                  className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
                />
                <label
                  htmlFor="remember-me"
                  className="text-gray-700 ml-3 block text-sm "
                >
                  Remember me
                </label>
              </div>
            </div>

            <div className="!mt-8">
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm tracking-wider font-semibold rounded-md bg-blue-700 hover:bg-blue-800 text-white focus:outline-none"
              >
                Login
              </button>
            </div>
            <p className="text-gray-800 text-sm mt-6 text-center">
              Don't have an account ?{" "}
              <NavLink
                to="/signup"
                className="text-indigo-600 font-semibold hover:underline ml-1"
              >
                SignUp here
              </NavLink>
            </p>
            <p className="text-gray-800 text-sm mt-6 text-center">
              <NavLink
                to="/"
                className="text-blue-700 font-semibold hover:underline ml-1"
              >
                Forget Password
              </NavLink>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default LoginForm;
