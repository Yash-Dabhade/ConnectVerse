import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import GoogleSignInPage from "../pages/GoogleSignInPage";
import Page404 from "../pages/Page404";
import Home from "../pages/Home";

export default function AppRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/google/:token" element={<GoogleSignInPage />} />

        <Route path="/*" element={<Page404 />} />
      </Routes>
    </>
  );
}
