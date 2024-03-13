const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const knex = require("knex");
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";
const app = express();

function GoogleUser(token, res) {
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
            }
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

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "112233",
    database: "visionai-db",
  },
  pool: { min: 0, max: 20 },
});

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/login", (req, res) => {
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
});

app.post("/signup", (req, res) => {
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
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({
      id: id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user);
      } else {
        res.status(400).json("Not found");
      }
      console.log(user);
    });
});

app.get("/rank", (req, res) => {
  db.select("*")
    .from("users")
    .orderBy("entries", "desc")
    .limit(5)
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json("Error fetching users");
    });
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.json("error"));
});

app.listen(3001, () => {
  console.log("app is running on 3001");
});

/*
/res = this is working
/signin --> POST = succes/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/
