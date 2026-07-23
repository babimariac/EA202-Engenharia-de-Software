var http = require('http'); // Importa o módulo HTTP nativo do Node.js para criar um servidor web

const upperCase = require('upper-case').upperCase; // Importa a função upperCase do módulo 'upper-case' que transforma strings em letras maiúsculas

http.createServer(function (req, res) { // Cria o servidor web que vai rodar a cada requisição recebida
  res.write(upperCase('Hello World')); // Escreve "HELLO WORLD" (em maiúsculas) na resposta que será enviada para o cliente
  res.end(); // Finaliza a resposta e a envia para o cliente
}).listen(2020); // Faz o servidor escutar na porta 2020, ou seja, ele vai responder às requisições feitas para essa porta
