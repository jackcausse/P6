// Importation de bcrypt pour hasher le password
const bcrypt = require('bcrypt')
// Importation de jwt
const jwt = require('jsonwebtoken')
// Importation User de la base de donnée
const User = require('../models/User')
// variable d'environnement
const dotenv = require('dotenv').config()

// Signup pour enregistrer un nouvel utilisateur dans la base de données
exports.signup = (req, res, next) => {
  // Hacher le mot de passe avant de l'envoyer dans la base de données
  bcrypt
    // 10 = nombre de fois exécuté par l'algorythme de hashage pour crypter le mot de passe
    .hash(req.body.password, 10)
    .then((hash) => {
      // Mot de passe envoyé dans la base de donnée
      const user = new User({
        email: req.body.email,
        password: hash,
      })
      // Crée un nouvel utilisateur
      user
        .save()
        .then(() => res.status(201).json({message: 'Utilisateur créé !'}))

        .catch((error) =>
          res.status(400).json({error: 'Identifiant ou mot de passe incorrect'})
        )
    })
    .catch((error) => res.status(500).json({error}))
}

// Connecte à un compte utilisateur
exports.login = (req, res, next) => {
  // Cherche si l'adresse mail est déjà utilisée
  User.findOne({email: req.body.email})
    .then((user) => {
      //Si l'utilisateur n'est pas trouvé
      if (!user) {
        return res.status(401).json({error: 'Utilisateur non trouvé !'})
      }
      bcrypt
        // Si un utilisateur est trouvé bcrypt compare le hash du mot de passe à celui de la requête
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Si le mot de passe est incorect
          if (!valid) {
            return res
              .status(401)
              .json({error: 'Identifiant ou mot de passe incorrect !'})
          }
          // Utilisateur authentifié
          res.status(200).json({
            userId: user._id,
            // jsonwebtoken donne un token à l'utilisateur afin d'utiliser l'app
            // 'process.env.sel'
            token: jwt.sign({ userId: user._id }, `${process.env.SECRET_KEY}`, {
              // token: jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            // token: jwt.sign({userId: user._id}, 'process.env.sel', {
              expiresIn: '24h',
            }),
          })
        })
        .catch((error) => res.status(500).json({error}))
    })
    .catch((error) => res.status(500).json({error}))
}
