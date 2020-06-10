const express = require("express");
const path = require("path");
const cors = require("cors");
const nunjucks = require("nunjucks");
const db = require('./database/db');

const server = express();

nunjucks.configure(path.resolve(__dirname, "views"), {
  express: server,
  noCache: true,
});

server.use(express.static(path.resolve(__dirname, "..", "public")));
// server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

server.get("/", (req, res) => {
  return res.render("index.njk");
});

server.get("/create-point", (req, res) => {
  return res.render("create-point.njk", { saved: false });
});

server.post("/savepoint", (req, res) => {
  const query = `
    INSERT INTO places (
      name,
      image,
      address,
      address2,
      state,
      city,
      items 
    ) VALUES (
      $name,
      $image,
      $address,
      $address2,
      $state,
      $city,
      $items 
    )
  `

  const values = {
    $name: req.body.name, 
    $image: req.body.image,
    $address: req.body.address,
    $address2: req.body.address2,
    $state: req.body.state,
    $city: req.body.city,
    $items: req.body.items,
  };

  db.run(query, values, (err) => {
    if (err) {
      console.error(err);
      return res.send("Erro na cadastro!");
    }
    return res.render("create-point.njk", { saved: true })
  })
});

server.get("/search-results", (req, res) => {
  const {search} = req.query;

  const render = places => {
    return res.render("search-results.njk", { places, total: places.length });
  }

  if (!search) {
    return render([]);
  }
  db.all(`SELECT * FROM places WHERE city LIKE $search`, { $search: search }, (error, places = []) => {
    if (error) {
      console.error(error);
      return res.send("Erro na pesquisa!");
    }
    render(places)
  });
});

server.listen(5000);
