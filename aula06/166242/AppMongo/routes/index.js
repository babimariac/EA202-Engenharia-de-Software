var express = require('express');
var router = express.Router();
var mongoOp = require('../models/mongo');

// CORS middleware
router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Request-With');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

function getRootPage(req, res) {
  var path = 'index.html';
  res.header('Cache-Control', 'no-cache');
  res.sendFile(path, {"root": "./"});
}

async function getAlunos(req, res) {
  try {
    const data = await mongoOp.find({});
    res.json({"alunos": data});
  } catch(err) {
    res.status(500).json({"resultado": "falha de acesso ao BD"});
  }
}

async function postAlunos(req, res) {
  try {
    const { ra, nome, curso } = req.body;
    const existingAluno = await mongoOp.findOne({ra});
    if (existingAluno) {
      return res.status(409).json({"resultado": "aluno ja existente"});
    }
    const newAluno = new mongoOp({ra, nome, curso});
    await newAluno.save();
    res.status(201).json({"resultado": "aluno inserido"});
  } catch (err) {
    res.status(500).json({"resultado": "falha de acesso ao BD"});
  }
}

async function getAlunoByRA(req, res) {
  try {
    const data = await mongoOp.findOne({ra: req.params.ra});
    if (!data) {
      return res.status(404).json({"resultado": "aluno inexistente"});
    }
    res.json({"alunos": [data]});
  } catch (err) {
    res.status(500).json({"resultado": "falha de acesso ao BD"});
  }
}

async function putAlunoByRA(req, res) {
  try {
    const { nome, curso } = req.body;
    const updatedAluno = await mongoOp.findOneAndUpdate(
      {ra: req.params.ra},
      {nome, curso},
      {new: true}
    );
    if (!updatedAluno) {
      return res.status(404).json({"resultado": "aluno inexistente"});
    }
    res.json({"resultado": "aluno atualizado", "aluno": updatedAluno});
  } catch(err) {
    res.status(500).json({"resultado": "falha de acesso ao BD"});
  }
}

async function deleteAlunoByRA(req, res) {
  try {
    const deletedAluno = await mongoOp.findOneAndDelete({ra: req.params.ra});
    if (!deletedAluno) {
      return res.status(404).json({"resultado": "aluno inexistente"});
    }
    res.json({"resultado": "aluno removido"});
  } catch(err) {
    res.status(500).json({"resultado": "falha de acesso ao BD"});
  }
}

router.route('/')
  .get(getRootPage);

router.route('/alunos')
  .get(getAlunos)
  .post(postAlunos);

router.route('/alunos/:ra')
  .get(getAlunoByRA)
  .put(putAlunoByRA)
  .delete(deleteAlunoByRA);

module.exports = router;