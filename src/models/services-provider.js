const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
    },
    sobrenome: {
        type: String,
        require: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    senhaHash:{
        type: String,
        required: true
    },
    services: {
        type: String,
        required: true
    },

}, 
{
    collection: 'services_provider'
},);

module.exports = mongoose.model('services_provider', UserSchema)