const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter((repo) => repo.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const likes = 0;

  const repository = { id: uuid(), title, url, techs, likes };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const projectIndex = repositories.findIndex((repo) => repo.id == id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  if (title != "") {
    repositories[projectIndex].title = title;
  }
  if (url != "") {
    repositories[projectIndex].url = url;
  }
  if (techs != "") {
    repositories[projectIndex].techs = techs;
  }

  // repositories[projectIndex] = repository;

  return response.json(repositories[projectIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex((repo) => repo.id == id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(projectIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const projectIndex = repositories.findIndex((repo) => repo.id == id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  const likes = repositories[projectIndex].likes + 1;

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[projectIndex] = repository;

  return response.json(repository);
});

module.exports = app;
