import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as LoadingSpinner } from "../assets/loading.svg";

const ImageLinkForm = ({
  onInputChange,
  onSubmit,
  InputImage,
  setInputImage,
  Image,
  ImageBox,
  CalculateImageBox,
  ImageBoxData,
  isLoading,
}) => {
  function Clear() {
    setInputImage("");
  }

  return (
    <>
      <div className=" min-h-[100vh] flex flex-col items-center justify-center ">
        <div className=" flex justify-between h-60 lg:w-1/2 w-3/4 mx-auto  p-10 items-center flex-col shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-SecondaryWhite border border-TertiaryWhite rounded-3xl  ">
          <div className="relative sm:w-1/2 w-fit mx-auto">
            <input
              className="p-1 w-full bg-white text-black  rounded-xl	outline-none focus:ring-0 "
              type="text"
              onChange={onInputChange}
              value={InputImage}
            />
            <button
              onClick={Clear}
              className={
                InputImage
                  ? "absolute bg-tertiary py-1 px-3 -right-10  rounded-full cursor-pointer	hover:bg-[rgb(32,33,35,0.5)]  ease-in duration-300"
                  : "hidden absolute bg-tertiary py-1 px-3 -right-10  rounded-full cursor-pointer	hover:bg-[rgb(32,33,35,0.5)]  ease-in duration-300"
              }
            >
              <FontAwesomeIcon
                icon={faX}
                className="text-SecondaryWhite text-sm"
              />
            </button>
          </div>

          <p className="text-lg text-center 	">
            Enter an image URL to detect a face.
          </p>
          <button
            className="w-40 h-10 flex items-center justify-center py-2 px-4 rounded-xl bg-tertiary text-xl hover:bg-[rgb(32,33,35,0.5)] ease-in duration-300"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner className="animate-spin-slow h-5 w-5 fill-current text-white" />
            ) : (
              "Detect Face"
            )}
          </button>
        </div>
      </div>
      <div
        className={
          Image
            ? "relative overflow-hidden h-auto lg:w-1/2 w-3/4 mx-auto p-2 mt-[-25vh] mb-[25vh]  shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-SecondaryWhite border border-TertiaryWhite rounded-3xl "
            : " hidden "
        }
      >
        <img
          id="imageElement"
          className=" mx-auto rounded-3xl"
          src={Image}
          onLoad={() => CalculateImageBox(ImageBoxData)}
          alt=""
        />
        <div
          className="absolute shadow-[0px_0px_0px_4px_#81e6d9] flex-wrap flex justify-center "
          style={{
            top: ImageBox.topRow,
            right: ImageBox.rightCol,
            bottom: ImageBox.bottomRow,
            left: ImageBox.leftCol,
          }}
        ></div>
      </div>
    </>
  );
};

export default ImageLinkForm;
