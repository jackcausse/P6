const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// créer un compte utilisateur
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      })
      // On crée un nouvel utilisateu
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
        
        .catch((error) => res.status(400).json({error}))
    })
    .catch((error) => res.status(500).json({error}))
}

// On connecte à un compt uilisateur
exports.login = (req, res, next) => {
  // On cherche si l'adresse mail est déjà utilisée
  User.findOne({email: req.body.email})
    .then((user) => {
      if (!user) {
        return res.status(401).json({error: 'Utilisateur non trouvé !'})
      }
      bcrypt
        // On compare le hash du mot de passe à celui de la requête
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({error: 'Mot de passe incorrect !'})
          }
          res.status(200).json({
            userId: user._id,
            //  On donne un token à l'utilisateur                                   SECRET
            // token: jwt.sign({userId: user._id}, 'RANDOM_TOKEN_SECRET', {
            token: jwt.sign({userId: user._id}, 'process.env.sel', {
              expiresIn: '24h',
            }),
          })
        })
        .catch((error) => res.status(500).json({error}))
    })
    .catch((error) => res.status(500).json({error}))
}
