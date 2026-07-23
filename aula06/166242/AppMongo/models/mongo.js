var mongoose = require("mongoose");
conn1 = mongoose.createConnection('mongodb://mongo:27017/alunosDB', {useNewUrlParser: true, useUnifiedTopology: true});
var Schema = mongoose.Schema;
var alunoSchema = new Schema({
    "ra": {type: String, required: true, unique: true},
    "nome": {type: String, required: true},
    "curso": {type: String, required: true}
});
module.exports = conn1.model('alunos', alunoSchema);
