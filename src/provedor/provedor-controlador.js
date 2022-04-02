const Provedor = require('./provedor-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const jwt = require('jsonwebtoken');

const ObjectId = require("mongodb").ObjectId;
const services_provider = require('../models/services-provider');

const crypto = require('crypto');
const moment = require('moment');

function criaTokenJWT(provedor) {
    const payload = {
      id: provedor.id
    };

    const token = jwt.sign(payload, process.env.Chave_JWT, { expiresIn: '15m' });
    return token;

}

function criaRefreshToken(provedor) {
  const refresh_token =  crypto.randomBytes(24).toString('hex');
  const dataExperiracao = moment().add(5, 'd').unix();
  
  return refresh_token;
}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, sobrenome, senha, services } = req.body;

    try {
      const provedor = new Provedor({
        nome,
        sobrenome,
        email,
        services
      });

      await provedor.adicionaSenha(senha);

      await provedor.adiciona();

      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  login: (req, res) => {
    const token = criaTokenJWT(req.user);
    const refreshToken = criaRefreshToken(req.user);
    res.set('Authorization', token);
    res.status(200).send({ refreshToken });
  }
};
