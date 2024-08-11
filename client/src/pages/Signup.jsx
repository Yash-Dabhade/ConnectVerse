import React, { useEffect } from "react";
import Header from "../components/Header";
import SignUpForm from "../components/SignUpForm";

function Signup() {
  useEffect(() => {
    sessionStorage.clear();
    localStorage.clear();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center gap-12">
      <Header />
      <SignUpForm />
    </div>
  );
}

export default Signup;
