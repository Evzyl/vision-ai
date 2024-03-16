import LogoSvg from "../assets/eye-svgrepo-com.svg";
import GoogleSVG from "../assets/7123025_logo_google_g_icon.svg";
import { Link, useParams, useNavigate } from "react-router-dom";
import NotFound from "./NotFound";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

const Auth = ({ LoadUser }) => {
  let { page } = useParams();
  const navigate = useNavigate();
  let [LoginEmail, setLoginEmail] = useState("");
  let [LoginPassword, setLoginPassword] = useState("");
  let [SignUpEmail, setSignUpEmail] = useState("");
  let [SignUpPassword, setSignUpPassword] = useState("");
  let [SignUpName, setSignUpName] = useState("");

  function OnEmailChange(event) {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      if (page === "signup") {
        setSignUpEmail(email);
      } else {
        setLoginEmail(email);
      }
    } else {
      setSignUpEmail("");
      setLoginEmail("");
    }
  }
  function onNameChange(event) {
    setSignUpName(event.target.value);
  }
  function OnPasswordChange(event) {
    if (page === "signup") {
      setSignUpPassword(event.target.value);
    } else {
      setLoginPassword(event.target.value);
    }
  }

  function onSubmit(googleToken) {
    if (
      (page === "signup" && googleToken) ||
      (page === "signup" && SignUpName && SignUpEmail && SignUpPassword)
    ) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/signup`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: SignUpName,
          email: SignUpEmail,
          password: SignUpPassword,
          googleToken: googleToken,
        }),
      })
        .then((response) => response.json())
        .then((user) => {
          if (user !== "User already exists" && user !== "error") {
            LoadUser(user);
            navigate("/");
          } else {
            window.location.reload();
          }
        });
    } else if (
      (page === "login" && googleToken) ||
      (page === "login" && LoginEmail && LoginPassword)
    ) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: LoginEmail,
          password: LoginPassword,
          googleToken: googleToken,
        }),
      })
        .then((response) => response.json())
        .then((user) => {
          if (user !== "error" || user !== "invalid password") {
            LoadUser(user);
            navigate("/");
          } else {
            window.location.reload();
          }
        });
    } else {
      console.log(
        `Error: ${page === "signup" ? "Sign up" : "Log in"} form is not valid`
      );
    }
  }
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      onSubmit(tokenResponse.access_token); // Call onSubmit with the Google token
    },
  });

  if (page === "signup" || page === "login") {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 ">
        <Link className="flex items-center justify-center py-5 " to="/">
          <img
            className="w-12 h-12 bg-white p-1 rounded-full"
            src={LogoSvg}
            alt="Logo"
          ></img>
          <p className="mx-2 text-white">vision.ai</p>
        </Link>
        <div className="w-full bg-primary border border-TertiaryWhite rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 flex flex-col items-center">
            <h1 className="text-xl  leading-tight tracking-tight text-white md:text-2xl ">
              {page === "signup"
                ? "Create new account"
                : "Log in to your account"}
            </h1>
            <form className="space-y-4 w-100% md:space-y-6" action="#">
              <div className={page === "login" ? "hidden" : "block"}>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-SecondaryWhite"
                >
                  Your name
                </label>
                <input
                  onChange={onNameChange}
                  type="text"
                  name="name"
                  id="name"
                  className="bg-white text-black sm:text-sm rounded-lg  block w-full p-2.5 focus:ring-2 focus:ring-secondary"
                  placeholder="name"
                  required=""
                ></input>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-SecondaryWhite"
                >
                  Your email
                </label>
                <input
                  onChange={OnEmailChange}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-white text-black sm:text-sm rounded-lg  block w-full p-2.5 focus:ring-2 focus:ring-secondary"
                  placeholder="name@company.com"
                  required=""
                ></input>
              </div>
              <div className="pb-5">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-SecondaryWhite"
                >
                  Password
                </label>
                <input
                  onChange={OnPasswordChange}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-white text-black sm:text-sm rounded-lg  block w-full p-2.5 focus:ring-2 focus:ring-secondary"
                  required=""
                ></input>
              </div>
              <button
                className=" w-full text-white bg-secondary hover:bg-opacity-50 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                onClick={() => onSubmit(null)}
                type="button"
              >
                {page === "signup" ? "Sign up" : "Log in"}
              </button>
              <p className="text-sm font-light text-SecondaryWhite text-center">
                {page === "signup"
                  ? "Have an account already?"
                  : "Don’t have an account?"}
                <Link
                  to={page === "signup" ? "/auth/login" : "/auth/signup"}
                  className="ml-1 font-medium text-secondary hover:underline"
                >
                  {page === "signup" ? "Login" : "Sign In"}
                </Link>
              </p>
              <div
                className="flex items-center py-2 text-SecondaryWhite w-100% after:content-[''] after:border-b-[1px] after:border-b-SecondaryWhite after:border-solid after:flex-1 after:h-1 
                    before:content-[''] before:border-b-[1px] before:border-b-SecondaryWhite before:border-solid before:flex-1 before:h-1"
              >
                <span className="text-center text-sm px-2">OR</span>
              </div>

              <button
                onClick={() => login()}
                className="flex items-center w-full text-white bg-black bg-opacity-0 border-solid border-TertiaryWhite border-[1px] hover:bg-opacity-10 font-medium rounded-lg text-sm pl-2 text-left cursor-pointer"
                type="button"
              >
                <img className="w-10 h-10" src={GoogleSVG} alt="Logo"></img>
                <p>Continue With Google</p>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  } else {
    return <NotFound />;
  }
};

export default Auth;
