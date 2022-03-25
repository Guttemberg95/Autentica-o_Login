const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    titulo: {
        type: String,
        require: true,
    },
    conteudo:{
        type: String,
        required: true,
    },

},
{
    collection: 'posts'
},);

//const Person = mongoose.model('User', UserSchema);

module.exports = mongoose.model('Post', UserSchema)