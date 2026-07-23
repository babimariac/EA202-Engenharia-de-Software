const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index.js');

const app = express();

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/unievent', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Configurações do Express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/', indexRouter);

// Iniciar o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;