const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    nome: {
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

});

//const Person = mongoose.model('User', UserSchema);

module.exports = mongoose.model('Person', UserSchema)