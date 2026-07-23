const mongoose = require('mongoose');

const ingressoSchema = new mongoose.Schema({
    evento: { type: mongoose.Schema.Types.ObjectId, ref: 'Evento', required: true },
    tipo: { type: String, required: true },
    preco: { type: Number, required: true },
    quantidade: { type: Number, required: true },
    vendidos: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ingressoSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Ingresso', ingressoSchema);