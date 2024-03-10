import React from "react";
import LogoSvg from "../assets/eye-svgrepo-com.svg";
const Logo = () => {
  return (
    <div className="flex items-center justify-center ">
      <img
        className="w-12 h-12 bg-white p-1 rounded-full	"
        src={LogoSvg}
        alt="Logo"
      ></img>
      <p className="mx-2">vision.ai</p>
    </div>
  );
};

export default Logo;
