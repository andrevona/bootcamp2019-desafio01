const express = require("express");

const server = express();

server.use(express.json());

projects = [
  {
    id: "1",
    title: "Projeto1",
    tasks: ["Tarefa1"]
  },
  {
    id: "2",
    title: "Projeto2",
    tasks: ["Tarefa1", "Tarefa2"]
  }
];

let numberReqs = 0;

// Crie um middleware global chamado em todas requisições que imprime (log)
// uma contagem de quantas requisições foram feitas na aplicação até então
server.use((req, res, next) => {
  numberReqs++;

  console.log(`Requisições feitas => ${numberReqs}`);

  next();
});

// Crie um middleware que será utilizado em todas rotas que recebem o ID do
// projeto nos parâmetros da URL que verifica se o projeto com aquele ID existe.
// Se não existir retorne um erro, caso contrário permita a requisição continuar
function checkIfProjectExists(req, res, next) {
  const projectID = req.params.id;

  const project = projects.find(x => x.id === projectID);

  if (!project) {
    return res.status(400).json({ error: `Não há projeto de ID ${projectID}` });
  }

  return next();
}

// GET /projects: Rota que lista todos projetos e suas tarefas
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// POST /projects: Rota recebe id e title no corpo de cadastrar um novo
// projeto dentro de um array no seguinte formato:
// { id: "1", title: 'Novo projeto', tasks: [] }
server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;

  const project = { id, title, tasks };

  projects.push(project);

  return res.json(project);
});

// DELETE /projects/:id: Rota deleta o projeto com o id nos parâmetros
server.delete("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(x => x.id === id);

  projects.splice(index, 1);

  return res.send(`Projeto de ID ${id} deletado`);
});

// PUT /projects/:id: A rota deve alterar apenas o título do
// projeto com o id presente nos parâmetros da rota
server.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(x => x.id === id);

  project.title = title;

  return res.json(projects);
});

// POST /projects/:id/tasks => Rota recebe um campo title e armazena
// uma nova tarefa no array de tarefas de um projeto específico escolhido
// através do id presente nos parâmetros da rota;
server.post("/projects/:id/tasks", (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  const project = projects.find(x => x.id === id);

  project.tasks.push(task);

  return res.json(projects);
});

server.listen(3001);
