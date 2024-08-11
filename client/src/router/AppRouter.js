import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Page404 from "../pages/Page404";
import Home from "../pages/Home";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/*" element={<Page404 />} />
      </Routes>
    </>
  );
}
