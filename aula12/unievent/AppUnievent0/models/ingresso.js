const mongoose = require('mongoose');

const ingressoSchema = new mongoose.Schema({
    evento: { type: mongoose.Schema.Types.ObjectId, ref: 'Evento', required: true },
    tipo: { type: String, required: true },
    preco: { type: Number, required: true },
    quantidade: { type: Number, required: true }
});

module.exports = mongoose.model('Ingresso', ingressoSchema);