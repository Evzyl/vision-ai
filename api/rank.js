// api/rank.js
const db = require("./db");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  db.select("*")
    .from("users")
    .orderBy("entries", "desc")
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json("Error fetching users");
    });
};
