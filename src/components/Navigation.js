import React from "react";
import { useState } from "react";
import LogoSvg from "../assets/eye-svgrepo-com.svg";
import AccountIcon from "../assets/icons8-account-64.png";
import { Link } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

const Navigation = ({ User, setUser, setImage }) => {
  const [Navbar, setNavbar] = useState(false);
  function changeBackground() {
    if (window.scrollY >= 100) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  }
  window.addEventListener("scroll", changeBackground);

  function LogOut() {
    setUser({
      id: "",
      name: "",
      email: "",
      entries: 0,
      joined: "",
    });
    googleLogout();
    setImage("");
  }

  return (
    <div
      className={
        Navbar
          ? " z-10 bg-opacity-50 fixed top-0 left-0 right-0 bg-secondary   text-SecondaryWhite shadow-[0px_3px_9px_0px_#00000024] sm:flex-row	 sm:justify-between flex flex-col justify-center items-center mx-auto px-10 py-3"
          : "z-10  fixed top-0 left-0 right-0 bg-secondary   text-white shadow-[0px_3px_9px_0px_#00000024] sm:flex-row	sm:justify-between flex flex-col justify-center items-center mx-auto px-10 py-3"
      }
    >
      <div className="flex items-center justify-center mb-5 sm:mb-0 ">
        <img
          className="w-11 h-11 bg-white p-1 rounded-full	"
          src={LogoSvg}
          alt="Logo"
        ></img>
        <p className="mx-2">vision.ai</p>
      </div>
      {User.id === "" ? (
        <Link to="/auth/login">
          <img
            className="w-12 h-12 p-1 rounded-full hover:opacity-75 ease-in duration-300"
            src={AccountIcon}
            alt="Logo"
          ></img>
        </Link>
      ) : (
        <button
          onClick={LogOut}
          className="text-white text-lg underline decoration-transparent hover:decoration-white ease-in duration-300"
        >
          Log Out
        </button>
      )}
    </div>
  );
};

export default Navigation;
