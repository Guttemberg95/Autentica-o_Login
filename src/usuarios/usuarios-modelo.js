const { InvalidArgumentError } = require('../erros');
const validacoes = require('../validacoes-comuns');
const bcrypt = require('bcrypt');

const Person = require('../models/Person');
const ObjectId = require("mongodb").ObjectId;

class Usuario {
  constructor(usuario) {
    this.id = usuario.id;
    this.nome = usuario.nome;
    this.email = usuario.email;
    this.senhaHash = usuario.senhaHash;
    this.telefone = usuario.telefone;
    this.genero = usuario.genero;
    this.data_nascimento = usuario.data_nascimento;
    this.cidade = usuario.cidade;
    this.estado = usuario.estado;
    this.endereco = usuario.endereco;

    this.valida();
  }

  async adiciona() {
    if (await Usuario.buscaPorEmail(this.email)) {
      throw new InvalidArgumentError('O usuário já existe!');
    }

    return Person.create(this);
  }

  async adicionaSenha(senha) {

    validacoes.campoStringNaoNulo(senha, 'senha');
    validacoes.campoTamanhoMinimo(senha, 'senha', 8);
    validacoes.campoTamanhoMaximo(senha, 'senha', 64);
    
    this.senhaHash = await Usuario.gerarSenhaHash(senha);
  }

  valida() {
    validacoes.campoStringNaoNulo(this.nome, 'nome');
    validacoes.campoStringNaoNulo(this.email, 'email');
  }

  
  async deleta() {
    return Person.deleteOne(this);
  }
  
  static async buscaPorId(id) {
    const usuario = await Person.findById({ _id: ObjectId(id) });
    if (!usuario) {
      return null;
    }
    
    return new Usuario(usuario);
  }
  
  static async buscaPorEmail(email) {
    const usuario = await Person.findOne({email: email});
    if (!usuario) {
      return null;
    }
    
    return new Usuario(usuario);
  }

  static lista() {
    return Person.find();
  }

  static gerarSenhaHash(senha) {
    const custoHash = 12;
    return bcrypt.hash(senha, custoHash);
  }
}

module.exports = Usuario;
