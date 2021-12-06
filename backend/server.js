const express = require("express");
const app = express();
const cors = require('cors')
const devpun = require("devpun");
const jokesDB = require("devpun/jokes.json");
const port = process.env.PORT || 1234;

app.use(
  cors({
    origin: ['http://localhost:1234', '<deployed URL>'],
  })
);

app.get("/random", (_req, res) => {
  const getRandomJoke = devpun.random();
  res.json(getRandomJoke);
});

app.get("/by-category", (req, res) => {
  const categoryNames = req.query.name;

  if (!categoryNames) {
    res.sendStatus(400);
  }
  const jokeCategory = devpun.list(categoryNames);
  res.json(jokeCategory);
});

app.get("/Popular", (_req, res) => {
  const ratingJokes = jokesDB
    .filter((joke) => joke.rating === 5)
    .map((joke) => joke.text);
  res.json(ratingJokes);
});

app.get("/search", (req, res) => {
  const searchJokes = req.query.text;

  if (!searchJokes) {
    res.sendStatus(400);
  }
  const everyJokes = devpun
    .list()
    .filter((joke) => joke.toLowerCase().includes(searchJokes.toLowerCase()));
  res.json(everyJokes);
});

app.get("/categories", (req, res) => {
  const allCategories = jokesDB
    .map((joke) => joke.tags)
    .reduce((acc, tags) => [...acc, ...tags], []);
  const copyOfCategories = Array.from(new Set(allCategories));
  res.send(copyOfCategories);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
