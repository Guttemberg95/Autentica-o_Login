const usuariosControlador = require('./usuarios-controlador');
const middlewaresAutenticacao = require('./middlewares-autenticator')

module.exports = app => {
  app
    .route('/usuario/login')
    .post(
    middlewaresAutenticacao.local, 
    usuariosControlador.login
    );

  app
    .route('/usuario/logout')
    .get(
    middlewaresAutenticacao.bearer, 
    usuariosControlador.logout
    );

  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app
    .route('/usuario/:email')
    .get(usuariosControlador.lista_email);
  
  app
  .route('/usuario/:id')
  .delete(
    middlewaresAutenticacao.bearer,
    usuariosControlador.deleta); 
};
