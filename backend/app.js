// Importe express
const express = require('express')

// Déclaration de mongoose
const mongoose = require('mongoose')
const mongooseExpressErrorHandler = require('mongoose-express-error-handler')

// Déclaration des routes et contrôleurs
const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')

const path = require('path')
// variable d'environnement
const dotenv = require('dotenv')//.config()
const result = dotenv.config()

// Crée une application express
const app = express()
app.use(express.json())

app.use(mongooseExpressErrorHandler)
// Connection à la base de donnée mangoose
mongoose
  .connect(
    'mongodb+srv://bal650:test@test.to4g94m.mongodb.net/?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true}
    // `mongodb+srv:///${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
    // {useNewUrlParser: true, useUnifiedTopology: true}
  )
  .then(() => console.log('Connexion à MongoDB réussie!'))
  .catch(() => console.log('Connexion à MongoDB échouée!'))


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})
// Différentes route utilisées
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/sauces', saucesRoutes)
app.use('/api/auth', userRoutes)
module.exports = app
