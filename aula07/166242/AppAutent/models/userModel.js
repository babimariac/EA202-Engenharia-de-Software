var mongoose = require("mongoose");
conn1 = mongoose.createConnection('mongodb://mongo:27017/alunosDB', {useNewUrlParser: true, useUnifiedTopology: true});
var Schema = mongoose.Schema;

var userSchema = new Schema({
    "username": {type: String, unique: true, required: true},
    "password": {type: String, required: true},
    "role": {type: String, enum: ['user', 'admin'], default: 'user'}
});

module.exports = conn1.model('users', userSchema);