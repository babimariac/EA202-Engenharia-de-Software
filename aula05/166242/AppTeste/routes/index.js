var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'alunos.json');

// Certifique-se de que o diretório data existe
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Certifique-se de que o arquivo alunos.json existe
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

function readAlunosData() {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
}

function writeAlunosData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getRootPage(req, res) {
    var path = 'index.html';
    res.header('Cache-Control', 'no-cache');
    res.sendFile(path, {"root": "./"});
}

function getAlunos(req, res) {
    const alunos = readAlunosData();
    res.json({ alunos: Object.values(alunos) });
}

function postAlunos(req, res) {
    const aluno = req.body;
    const alunos = readAlunosData();
    
    if (!alunos[aluno.ra]) {
        alunos[aluno.ra] = aluno;
        writeAlunosData(alunos);
        res.json({ "resultado": "aluno inserido" });
    } else {
        res.json({ "resultado": "aluno ja existente" });
    }
}

function getAlunoByRA(req, res) {
    const alunos = readAlunosData();
    const aluno = alunos[req.params.id];
    
    if (aluno) {
        res.json(aluno);
    } else {
        res.json({ "resultado": "aluno inexistente" });
    }
}

function putAlunoByRA(req, res) {
    const alunos = readAlunosData();
    
    if (alunos[req.params.id]) {
        alunos[req.params.id] = req.body;
        writeAlunosData(alunos);
        res.json({ "resultado": "aluno atualizado" });
    } else {
        res.json({ "resultado": "aluno inexistente" });
    }
}

function deleteAlunoByRA(req, res) {
    const alunos = readAlunosData();
    
    if (alunos[req.params.id]) {
        delete alunos[req.params.id];
        writeAlunosData(alunos);
        res.json({ "resultado": "aluno removido" });
    } else {
        res.json({ "resultado": "aluno inexistente" });
    }
}

router.route('/*')
    .options(function(req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Request-With');
        res.sendStatus(200);
    });

router.route('/')
    .get(getRootPage);

router.route('/alunos')
    .get(getAlunos)
    .post(postAlunos);

router.route('/alunos/:id')
    .get(getAlunoByRA)
    .put(putAlunoByRA)
    .delete(deleteAlunoByRA);

module.exports = router;
