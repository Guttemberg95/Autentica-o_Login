const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const { estrategiasAutenticacao } = require('./src/usuarios');

var cors = require('cors')

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(express.json());

app.use(cors())

const DB_USER=process.env.DB_USER
const DB_PASSWORD= encodeURIComponent(process.env.DB_PASSWORD)

mongoose
.connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.i6g2v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
)
.then(() =>{
    console.log('conectamos ao mongoBD')
    app.listen(3003)
})
.catch((err) => console.log(err))

module.exports = app;
