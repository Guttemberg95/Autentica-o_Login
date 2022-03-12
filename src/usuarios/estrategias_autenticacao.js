const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError } = require('../erros');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function verificarUsuario(usuario) {
    if (!usuario) {
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
        const usuario = await Usuario.buscaPorEmail(email);
        verificarUsuario(usuario);       
        console.log(usuario.senhaHash);
        await verificarSenha(senha, usuario.senhaHash);

        done(null, usuario);
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
                const usuario = await Usuario.buscaPorId(payload.id);
                done(null, usuario); 
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