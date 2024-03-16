// api/googleUser.js
const axios = require("axios");
const db = require("./db");

function GoogleUser(token, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return axios
    .get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .then((googleUser) => {
      {
        db.select("*")
          .from("users")
          .where("email", "=", googleUser.email)
          .then((user) => {
            if (user.length) {
              return res.json(user[0]);
            } else {
              db("users")
                .returning("*")
                .insert({
                  email: googleUser.email,
                  name: googleUser.name,
                  joined: new Date(),
                })
                .then((user) => {
                  return res.json(user[0]);
                })
                .catch((err) => {
                  return res.json("error");
                });
            }
          })
          .catch((err) => {
            return res.json("error google user not found");
          });
      }
    })
    .catch((err) => {
      return res.json("error google token");
    });
}

module.exports = GoogleUser;
