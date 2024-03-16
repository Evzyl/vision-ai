import React from "react";
import { ImageLinkForm, Navigation, Rank, Footer } from "../components/index";
import { useState, useEffect } from "react";

//Api auth
const PAT = process.env.REACT_APP_PAT;
const USER_ID = process.env.REACT_APP_USER_ID;
const APP_ID = process.env.REACT_APP_APP_ID;
const MODEL_ID = process.env.REACT_APP_MODEL_ID;
const MODEL_VERSION_ID = process.env.REACT_APP_MODEL_VERSION_ID;

const Home = ({ User, setUser }) => {
  let [InputImage, setInputImage] = useState("");
  let [Image, setImage] = useState("");
  let [ImageBox, setImageBox] = useState({});
  let [ImageBoxData, setImageBoxData] = useState({});
  let [Error, setError] = useState("Error");
  let [isLoading, setIsLoading] = useState("");

  useEffect(() => {
    if (User.id !== "" && Image !== "") {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/image`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: User.id,
        }),
      })
        .then((response) => response.json())
        .then((count) => {
          setUser((prevUser) => ({ ...prevUser, entries: count }));
        });
    }

    // eslint-disable-next-line
  }, [Image, setUser]);

  useEffect(() => {
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: InputImage.trim(),
              // "base64": IMAGE_BYTES_STRING
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };

    if (InputImage.trim() !== "") {
      setIsLoading(true);
      fetch(
        "https://api.clarifai.com/v2/models/" +
          MODEL_ID +
          "/versions/" +
          MODEL_VERSION_ID +
          "/outputs",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setIsLoading(false);
          if (result.status.description === "Ok") {
            setImageBoxData(
              result.outputs[0].data.regions[0].region_info.bounding_box
            );
            setError("");
          } else {
            setError("Error: " + result.status.description);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError("Error fetching data");
          setIsLoading(false);
        });
    }
  }, [InputImage]);

  function onInputChange(event) {
    setInputImage(event.target.value);
  }

  function CalculateImageBox(data) {
    const imageElement = document.getElementById("imageElement");

    if (imageElement) {
      const imageWidth = Number(imageElement.width);
      const imageHeight = Number(imageElement.height);

      const ImageBoxObj = {
        leftCol: data.left_col * imageWidth,
        rightCol: imageWidth - data.right_col * imageWidth,
        topRow: data.top_row * imageHeight,
        bottomRow: imageHeight - data.bottom_row * imageHeight,
      };

      setImageBox(ImageBoxObj);
    } else {
      setError("Image element not found or not loaded.");
    }
  }

  function onSubmit() {
    if (!Error) {
      setImage(InputImage);
    } else {
      setImage("");
    }
  }

  return (
    <>
      <Navigation User={User} setUser={setUser} setImage={setImage} />
      <ImageLinkForm
        onInputChange={onInputChange}
        InputImage={InputImage}
        setInputImage={setInputImage}
        onSubmit={onSubmit}
        Image={Image}
        ImageBox={ImageBox}
        CalculateImageBox={CalculateImageBox}
        ImageBoxData={ImageBoxData}
        isLoading={isLoading}
      />
      <Rank User={User} />
      <Footer />
    </>
  );
};

export default Home;
