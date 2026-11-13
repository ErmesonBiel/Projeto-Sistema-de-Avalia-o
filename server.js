import express from "express";

const app = express();
app.use(express.json());

app.use(express.static("."));

const alunos = [
  { id: 1, nome: "Ana Beatriz", frequencia: 96, notas: [8.5, 9, 8] },
  { id: 2, nome: "Carlos Eduardo", frequencia: 82, notas: [6, 5.5, 6.5] },
  { id: 3, nome: "Fernanda Costa", frequencia: 70, notas: [7, 8] },
  { id: 4, nome: "João Pedro", frequencia: 91, notas: [4, 3.5, 5] },
];
let proximoId = 5;

app.get("/aluno", (req, res) => {
  return res.json(alunos);
});

app.post("/aluno", (req, res) => {
  const dados = req.body;
  const novo = {
    id: proximoId++,
    nome: dados.nome,
    frequencia: dados.frequencia,
    notas: dados.notas,
  };
  alunos.push(novo);
  return res.json({ message: "Dados cadastrados", aluno: novo });
});

app.delete("/aluno/:id", (req, res) => {
  const { id } = req.params;
  const index = alunos.findIndex((item) => item.id == id);
  if (index >= 0) {
    alunos.splice(index, 1);
    return res.json({ message: "Removido" });
  }
  return res.status(404).json({ message: "Aluno não encontrado" });
});

app.put("/aluno/:id", (req, res) => {
  const { id } = req.params;
  const aluno = alunos.find((item) => item.id == id);
  if (!aluno) {
    return res.status(404).json({ message: "Aluno não encontrado" });
  }
  const dados = req.body;
  Object.assign(aluno, dados, { id: aluno.id });
  return res.json({ message: "Atualizado", aluno });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
