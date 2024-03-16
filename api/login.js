// api/login.js
const db = require("./db");
const GoogleUser = require("./googleUser");
const bcrypt = require("bcrypt");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.body.googleToken !== null) {
    GoogleUser(req.body.googleToken, res); //check if user uses google to login
  } else {
    db.select("email", "hash")
      .from("login")
      .where("email", "=", req.body.email) //check if user exists
      .then((data) => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash); //compare hashed password
        if (isValid) {
          return db
            .select("*")
            .from("users")
            .where("email", "=", req.body.email)
            .then((user) => {
              res.json(user[0]);
            })
            .catch((err) => res.json("error"));
        } else {
          return res.json("invalid password");
        }
      })
      .catch((err) => res.json("error"));
  }
};
