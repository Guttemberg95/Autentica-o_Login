const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const Provedor_modelo = require('./provedor-modelo');
const { InvalidArgumentError } = require('../erros');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ObjectId = require("mongodb").ObjectId;
const Provedor = require('../models/services-provider');

function verificarUsuario(provedor) {
    if (!provedor) {
        throw new InvalidArgumentError('Não existe usuário com esse email');
    }
}

async function verificarSenha(senha, senhaHash) {
    const senhaValida = await bcrypt.compare(senha, senhaHash);
    if (!senhaValida) {
        throw new InvalidArgumentError('Email ou senha inválidos');
    }
}

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'senha',
        session: false
    }, async (email, senha, done) => {
        try {    
        const provedor = await Provedor.findOne({email});
        verificarUsuario(provedor);       
        await verificarSenha(senha, provedor.senhaHash);

        done(null, provedor);
        } catch (erro) {
            done(erro);
        } 
    })
);

passport.use(
    new BearerStrategy(
        async (token, done) => {
            try {
                const payload = jwt.verify(token, process.env.Chave_JWT);
                const provedor = await Provedor_modelo.buscaPorId(payload.id);
                done(null, provedor); 
            } catch (erro) {
                done(erro);
            }

        }
    )
);

passport.serializeUser(
    function(user, done) {
        done(null, user.id);
  }
);

passport.deserializeUser(
    function(id, done) {
        User.findOne(id, function (err, user) {
            done(err, user);
        }
    );
  }
);