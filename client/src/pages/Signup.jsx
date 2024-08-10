import React from "react";
import Header from "../components/Header";
import SignUpForm from "../components/SignUpForm";

function Signup() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      <Header />
      <SignUpForm />
    </div>
  );
}

export default Signup;
