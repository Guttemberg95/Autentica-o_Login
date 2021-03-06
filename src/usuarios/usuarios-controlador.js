const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const jwt = require('jsonwebtoken');

const ObjectId = require("mongodb").ObjectId;
const Person = require('../models/Person');

const crypto = require('crypto');
const moment = require('moment');

function criaTokenJWT(usuario) {
    const payload = {
      id: usuario.id
    };

    const token = jwt.sign(payload, process.env.Chave_JWT, { expiresIn: '15m' });
    return token;

}

function criaRefreshToken(usuario) {
  const refresh_token =  crypto.randomBytes(24).toString('hex');
  const dataExperiracao = moment().add(5, 'd').unix();
  
  return refresh_token;
}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha, telefone, genero, data_nascimento, endereco, cidade, estado } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        telefone,
        genero,
        data_nascimento,
        endereco,
        cidade,
        estado
      });

      await usuario.adicionaSenha(senha);

      await usuario.adiciona();

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
  },

  logout: async (req, res) => {
    try {
      const token = req.token
      res.status(204).send()
    } catch (error) {
      res.status(500).json({erro: erro.message})
    }
  },

  lista: async (req, res) => {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  deleta: async (req, res) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  },

  lista_email: async (req, res) => {
    const usuario = await Usuario.buscaPorEmail(req.params.email);

    try {
      res.status(200).send(usuario);
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  }
};
