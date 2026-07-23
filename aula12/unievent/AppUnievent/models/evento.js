const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    data: { type: Date, required: true },
    local: { type: String, required: true },
    descricao: { type: String, required: true },
    ingressos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingresso' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

eventoSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Evento', eventoSchema);