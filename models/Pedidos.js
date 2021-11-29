const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    pedido: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cliente',
    },
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario',
    },
    estado: {
        type: String,
        default: 'Pendiente'
    },
    creado: {
        type: Date,
        default: Date.now()
    }
})