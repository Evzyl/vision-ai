import React from "react";
import { ImageLinkForm, Navigation, Rank, Footer } from "../components/index";
import { useState, useEffect } from "react";

//Api auth
const PAT = "e05d7744cb734125bfc9170e55a6b4a9";
const USER_ID = "o98k58qnh6pn";
const APP_ID = "visionapp";
const MODEL_ID = "face-detection";
const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";

const Home = ({ User, setUser }) => {
  let [InputImage, setInputImage] = useState("");
  let [Image, setImage] = useState("");
  let [ImageBox, setImageBox] = useState({});
  let [ImageBoxData, setImageBoxData] = useState({});
  let [Error, setError] = useState("Error");
  let [isLoading, setIsLoading] = useState("");

  useEffect(() => {
    if (User.id !== "" && Image !== "") {
      fetch("http://localhost:3001/image", {
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
