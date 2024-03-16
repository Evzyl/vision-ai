// api/signup.js
const db = require("./db");
const GoogleUser = require("./googleUser");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.body.googleToken !== null) {
    GoogleUser(req.body.googleToken, res); //check if user uses google to sign up
  } else {
    db.select("*")
      .from("login")
      .where("email", "=", req.body.email)
      .then((data) => {
        if (data.length) {
          res.json("User already exists"); //check if user already exists
        } else {
          const hash = bcrypt.hashSync(req.body.password, saltRounds); //hash password
          db.transaction((trx) => {
            trx
              .insert({
                hash: hash, //insert hashed password, email into login table
                email: req.body.email,
              })
              .into("login")
              .returning("email")
              .then((loginEmail) => {
                return trx("users")
                  .returning("*")
                  .insert({
                    email: loginEmail[0],
                    name: req.body.name, //insert login table email, name, joined date into users table
                    joined: new Date(),
                  })
                  .then((user) => {
                    res.json(user[0]);
                  });
              })
              .then(trx.commit)
              .catch(trx.rollback);
          });
        }
      });
  }
};
