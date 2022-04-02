const { InvalidArgumentError } = require('../erros');
const validacoes = require('../validacoes-comuns');
const bcrypt = require('bcrypt');

const servicesprovider = require('../models/services-provider');
const ObjectId = require("mongodb").ObjectId;

class Provedor {
  constructor(provedor) {
    this.id = provedor.id;
    this.nome = provedor.nome;
    this.sobrenome = provedor.sobrenome;
    this.email = provedor.email;
    this.senhaHash = provedor.senhaHash;
    this.services = provedor.services;

    this.valida();
  }

  async adiciona() {
    if (await Provedor.buscaPorEmail(this.email)) {
      throw new InvalidArgumentError('O usuário já existe!');
    }

    return servicesprovider.create(this);
  }

  async adicionaSenha(senha) {

    validacoes.campoStringNaoNulo(senha, 'senha');
    validacoes.campoTamanhoMinimo(senha, 'senha', 8);
    validacoes.campoTamanhoMaximo(senha, 'senha', 64);
    
    this.senhaHash = await Provedor.gerarSenhaHash(senha);
  }

  valida() {
    validacoes.campoStringNaoNulo(this.nome, 'nome');
    validacoes.campoStringNaoNulo(this.email, 'email');
  }

  async deleta() {
    return servicesprovider.deleteOne(this);
  }
  
  static async buscaPorId(id) {
    const provedor = await servicesprovider.findById({ _id: ObjectId(id) });
    if (!provedor) {
      return null;
    }
    
    return new Provedor(provedor);
  }
  
  static async buscaPorEmail(email) {
    const provedor = await servicesprovider.findOne({email: email});
    if (!provedor) {
      return null;
    }
    
    return new Provedor(provedor);
  }

  static lista() {
    return servicesprovider.find();
  }

  static gerarSenhaHash(senha) {
    const custoHash = 12;
    return bcrypt.hash(senha, custoHash);
  }
}

module.exports = Provedor;
