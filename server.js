const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "movie_info",
});

db.connect((err) => {
  if (err) {
    console.log("Database Connection Error:", err);
  } else {
    console.log("Database Connected");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/movie", (req, res) => {

  const query = `
    SELECT
      Movie_Name,
      Genre,
      Year,
      IMDb_Rating,
      Director_ID
    FROM movie
    ORDER BY Movie_ID ASC
  `;

  db.query(query, (err, results) => {

    if (err) {
      console.log(err);
      return res.status(500).send("Database Error");
    }

    res.json(results);
  });
});

app.post("/addmovie", (req, res) => {

  console.log("POST Request Received");
  console.log(req.body);

  const {
    Movie_Name,
    Genre,
    Year,
    IMDb_Rating,
    Director_ID,
  } = req.body;

  const query = `
    INSERT INTO movie
    (
      Movie_Name,
      Genre,
      Year,
      IMDb_Rating,
      Director_ID
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      Movie_Name,
      Genre,
      Year,
      IMDb_Rating,
      Director_ID,
    ],
    (err,) => {

      if (err) {
        console.log("Database Error:", err);

        return res.status(500).send(`
          <h2>Insert Failed</h2>
        `);
      }

      res.send(`
        <h2>Movie Added Successfully</h2>
       
      `);
    }
  );
});

app.listen(5000, () => {
  console.log("Server Running On Port 5000");
});