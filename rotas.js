const posts = require('./src/posts');
const usuarios = require('./src/usuarios');
const provedor = require('./src/provedor');

module.exports = app => {
  app.get('/', (req, res) => {res.send('Olá pessoa!')});
  
  posts.rotas(app);
  provedor.rotas(app);
  usuarios.rotas(app);
};