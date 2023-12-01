// le sytème de fichier permet de modifier le système de fichiers
const fs = require('fs')
const Sauces = require('../models/Sauces')

// On crée une sauce
exports.createSauces = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce)
  delete saucesObject._id
  // delete saucesObject._userId//
  // On crée une nouvelle sauce
  const sauces = new Sauces({
    // L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
    ...saucesObject,
    // userId: req.auth.userId,//
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  })

  // On sauvegarde la sauce
  sauces
    .save()
    .then(() => {
      res.status(201).json({message: 'Objet enregistré!'})
    })

    .catch((error) => {
      res.status(400).json({message: error})
    })
}

// On obtiens toute les sauces
exports.getOneSauces = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id,
  })
    .then((sauces) => {
      res.status(200).json(sauces)
    })
    .catch((error) => {
      res.status(404).json({
        message: error,
      })
    })
}

// On modifie une sauces
exports.modifySauces = (req, res, next) => {
  const saucesObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : {...req.body}

  // On supprime une sauces
  delete saucesObject._userId
  Sauces.findOne({_id: req.params.id})
    .then((sauces) => {
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({message: 'Non autorisé!'})
      } else {
        Sauces.updateOne(
          {_id: req.params.id},
          {...saucesObject, _id: req.params.id}
        )
          .then(() => res.status(200).json({message: 'Objet modifié!'}))
          .catch((error) => res.status(401).json({message: error}))
      }
    })
    .catch((error) => {
      res.status(400).json({message: error})
    })
}

// On supprime une sauce
exports.deleteSauces = (req, res, next) => {
  Sauces.findOne({_id: req.params.id})
    .then((sauces) => {
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({message: 'Non autorisé'})
      } else {
        const filename = sauces.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          Sauces.deleteOne({_id: req.params.id})
            .then(() => {
              res.status(200).json({message: 'Sauce supprimé !'})
            })
            .catch((error) => res.status(401).json({message: error}))
        })
      }
    })
    .catch((error) => {
      res.status(500).json({message: error})
    })
}

// On obtiens toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    .then((sauces) => {
      res.status(200).json(sauces)
    })

    .catch((error) => {
      res.status(400).json({
        message: error,
      })
    })
}

// Utilistion de la méthode js include()
// Utilisation de l'opérateur $inc (mongoDB)
// utilisation de l'opérateur $push(mongoDB)
// Utilisation de l'opérateur $pull (mongoDB)

// On like, dislike retire le like
exports.likeSauces = (req, res, next) => {
  console.log('dans le controller de la route likeSauce')

  // On trouve une sauce
  Sauces.findOne({_id: req.params.id})
    .then((sauces) => {
    
      // Si le user id est false et si like === 1
      if (
        !sauces.usersLiked.includes(req.body.userId) &&
        req.body.like === 1
      ) {
        console.log('sauces + 1')

        // Mise à jour BDD
        Sauces
          .updateOne(
            {
              _id: req.params.id,
            },
            {
              // On incrémente like à 1
              $inc: {likes: 1},
              // On ajoute le userId dans le tableau de userLiked
              $push: {usersLiked: req.body.userId},
            }
          )

          .then(() => res.status(200).json({message: 'sauces like + 1'}))
          .catch((error) =>
            res.status(400).json({
              message: error,
            })
          )
      }

      // likes = 0 = pas de vote
      if (sauces.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        console.log('userId est dans usersLiked et like = 0')

        // mise à jour dans la BDD
        Sauces
          .updateOne(
            {
              _id: req.params.id,
            },
            {
              // On retire like
              $inc: {likes: -1},
              // On retire le userId dans le tableau de userLiked
              $pull: {usersLiked: req.body.userId},
            }
          )
          .then(() => res.status(200).json({message: 'SaucesLike 0'}))
          .catch((error) =>
            res.status(400).json({
              message: error,
            })
          )
      }

      // Like = -1 dislike = +1
      if (
        !sauces.usersDisliked.includes(req.body.userId) &&
        req.body.like === -1
      ) {
        console.log('userId est dans usersDisliked et dislikes = 1')

        // mise à jour dans la BDD
        Sauces
          .updateOne(
            {
              _id: req.params.id
            },
            {
              // On dislike
              $inc: {dislikes: 1},
              // On retire le userId dans le tableau de userdisliked
              $push: {usersDisliked: req.body.userId},
            }
          )
          .then(() => res.status(200).json({message: 'SaucesDislike +1'}))
          .catch((error) => res.status(400).json({message: error}))
      }

      // après un like = -1 on met un like = 0 = pas de vote, on enlève le dislike
      if (
        sauces.usersDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        console.log('userId est dans usersDisliked et like = 0')

        // mise à jour dans la BDD
        Sauces
          .updateOne(
            {
              _id: req.params.id
            },
            {
              // On retire dislike
              $inc: {dislikes: -1},
              // On retire le userId dans le tableau de userLiked
              $pull: {usersDisliked: req.body.userId},
            }
          )
          .then(() => res.status(200).json({message: 'usersDisliked  0'}))
          .catch((error) => res.status(400).json({ message: error, }))
      }
    })

    .catch((error) => 
      res.status(401).json({
        message: error,
      })
    )
}
