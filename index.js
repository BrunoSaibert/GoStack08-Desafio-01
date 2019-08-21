const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let totalRequests = 0;

//middlewares
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(project => project.id === id);

  if (!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }

  return next();
}

function countRequest(req, res, next) {
  totalRequests++;

  console.log(`Até o momento temos ${totalRequests} requisições`);

  return next();
}

server.post('/projects', countRequest, (req, res) => {
  projects.push(req.body);

  return res.json(projects);
});

server.get('/projects', countRequest, (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', countRequest, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  project.title = title;

  return res.json(projects);
});

server.delete('/projects/:id', countRequest, checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post(
  '/projects/:id/tasks',
  countRequest,
  checkProjectExists,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(project => project.id === id);

    project.tasks.push(title);

    return res.json(project);
  }
);

server.listen(3000);
