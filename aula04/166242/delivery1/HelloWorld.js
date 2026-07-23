var http = require('http'); // Importa o módulo HTTP nativo do Node.js para criar um servidor web

http.createServer(function (req, res) { // Cria um servidor usando uma função anônima que será executada a cada requisição
  res.write('Hello World'); // Escreve "Hello World" na resposta que será enviada para o cliente
  res.end(); // Finaliza a resposta, enviando-a de fato ao cliente
}).listen(2020); // Faz o servidor escutar na porta 2020, ou seja, ele vai responder às requisições feitas para essa porta
