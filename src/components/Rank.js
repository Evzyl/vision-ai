import React from "react";
import { useEffect, useState } from "react";

const Rank = ({ User }) => {
  let [RankUsers, setRankUsers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/rank`)
      .then((response) => response.json())
      .then((users) => {
        console.log(users);
        setRankUsers(users);
      })
      .catch((error) => {
        console.error("Error fetching top 5 users:", error);
      });
  }, [User]);
  const userRank = RankUsers.findIndex((user) => user.id === User.id) + 1;

  if (User.id === "") {
    return null;
  }

  return (
    <div className={"my-[25vh]"}>
      <h2 className=" text-lg text-SecondaryWhite text-center mb-5">
        <i className="text-white text-xl not-italic"> {User.name} </i>
        your current rank is{" "}
        <i className="text-white text-xl not-italic"> #{userRank}</i>, with
        <i className="text-white text-xl not-italic"> {User.entries} </i> faces
        detected
      </h2>
      <div className=" flex sm:w-fit w-3/4 p-5 mx-auto   items-center flex-col bg-tertiary shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-SecondaryWhite text-center border border-SecondaryWhite rounded-3xl ">
        <h1 className="text-white text-2xl">Ranks</h1>
        <ol className="p-3 ">
          <li className="my-2 px-8 relative">
            <i className="text-white not-italic text-lg  absolute left-0  ">
              1.
            </i>
            {RankUsers[0] && RankUsers[0].name} has detected a total of
            <i className="text-white text-lg not-italic">
              {" "}
              {RankUsers[0] && RankUsers[0].entries}{" "}
            </i>
            faces
          </li>
          <li className="my-2 px-8 relative">
            <i className="text-white not-italic text-lg  absolute left-0  ">
              2.
            </i>
            {RankUsers[1] && RankUsers[1].name} has detected a total of
            <i className="text-white text-lg not-italic">
              {" "}
              {RankUsers[1] && RankUsers[1].entries}{" "}
            </i>
            faces
          </li>
          <li className="my-2 px-8 relative">
            <i className="text-white not-italic text-lg  absolute left-0  ">
              3.
            </i>
            {RankUsers[2] && RankUsers[2].name} has detected a total of
            <i className="text-white text-lg not-italic">
              {" "}
              {RankUsers[2] && RankUsers[2].entries}{" "}
            </i>
            faces
          </li>
          <li className="my-2 px-8 relative">
            <i className="text-white not-italic text-lg  absolute left-0  ">
              4.
            </i>
            {RankUsers[3] && RankUsers[3].name} has detected a total of
            <i className="text-white text-lg not-italic">
              {" "}
              {RankUsers[3] && RankUsers[3].entries}{" "}
            </i>
            faces
          </li>
          <li className="my-2 px-8 relative">
            <i className="text-white not-italic text-lg  absolute left-0  ">
              5.
            </i>
            {RankUsers[4] && RankUsers[4].name} has detected a total of
            <i className="text-white text-lg not-italic">
              {" "}
              {RankUsers[4] && RankUsers[4].entries}{" "}
            </i>
            faces
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Rank;
