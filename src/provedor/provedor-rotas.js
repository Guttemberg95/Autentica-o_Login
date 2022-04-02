const provedorControlador = require('./provedor-controlador');
const middlewaresAutenticacao = require('./middlewares-autenticator')

module.exports = app => {
  app
    .route('/services-provider')
    .post(provedorControlador.adiciona)
  
  app
    .route('/services-provider/login')
    .post(
    middlewaresAutenticacao.local, 
    provedorControlador.login
    );
};