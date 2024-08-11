import React, { useEffect } from "react";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";

function Login() {
  useEffect(() => {
    sessionStorage.clear();
    localStorage.clear();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      <Header />
      <LoginForm />
    </div>
  );
}

export default Login;
