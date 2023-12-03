// Importation du module fs de node.js pour accéder aux fichiers du serveur
const fs = require('fs')

// Importation du models de la base de donnée MongoDB
const Sauces = require('../models/Sauces')

// On crée une sauce avec l'id de l'utilisateur
exports.createSauces = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce)
  delete saucesObject._id

  
  // console.log(req.body.sauce)
  // On crée une nouvelle sauce les likes, dislikes et l'image

  // delete saucesObject._userId//
  
  // On crée une nouvelle sauce
  const sauces = new Sauces({
    // L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
    ...saucesObject,
    
    // Crée l'url image avec le protocole et l'hôte de la requête et le nom du fichier
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  })

  // Sauvegarde la sauce dans la base de donnée
  sauces
    .save()
    .then(() => {
      res.status(201).json({message: 'Objet enregistré!'})
    })

    .catch((error) => {
      res.status(400).json({message: error})
    })
}

// On obtiens une sauce avec un utilisateur authentifié
exports.getOneSauces = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id,
  })
    // Sauce touvé
    .then((sauces) => {
      res.status(200).json(sauces)
    })
    .catch((error) => {
      res.status(404).json({
        message: error,
      })
    })
}

// On modifie une sauce avec l'identifiant de l'utilisateur qui la créée
exports.modifySauces = (req, res, next) => {
  // Trouve la sauce avec son identifiant
  Sauces.findOne({_id: req.params.id})
    .then((sauce) => {
      // Si l'utilisateur n'a pas créé la sauce
      if (req.auth.userId !== sauce.userId) {
        return res.status(403).json({message: 'Non autorisé !'})
      }

      // l'image est modifié l'image url
      const filename = sauce.imageUrl.split('/images/')[1]
     
      // Supprime le fichier
      fs.unlink(`images/${filename}`, () => {
        // Crée un nouvel objet sauce avec les données mise à jour plus la nouvelle image si un fichier image est remplacé
        const sauceObject = req.file
          ? {
              //  Récupère l'objet json
              ...JSON.parse(req.body.sauce),
              // Ajoute l'image url

              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                req.file.filename
              }`,
            }
          : {...req.body}
        // Sauvegarde la sauce dans la base de donnée
        Sauces.updateOne(
          {_id: req.params.id},
          {...sauceObject, _id: req.params.id}
        )
          .then(() => res.status(200).json({message: 'Sauce modifiée!'}))
          .catch((error) => res.status(401).json({message: 'Non autorisé'}))
      })
    })

    .catch((error) => res.status(500).json({message: error.message}))
}

// On supprime une sauce
exports.deleteSauces = (req, res, next) => {
  console.log(req.body)
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

// Utilisation de la méthode js include()
// La includes() méthode des Arrayinstances détermine si un tableau inclut une certaine valeur parmi ses entrées, en retournant true ou false selon le cas.
// Utilisation de l'opérateur $inc (mongoDB)
// Cet opérateur renvoie les documents qui correspondent aux valeurs spécifiées
// utilisation de l'opérateur $push(mongoDB)
// L’opérateur ajoute une valeur spécifiée à un tableau.
// Utilisation de l'opérateur $pull (mongoDB)
// L'opérateur supprime d'un tableau existant toutes les instances d'une ou plusieurs valeurs qui correspondent à une condition spécifiée.

// like, dislike des sauces
exports.likeSauces = (req, res, next) => {
  console.log('dans le controller de la route likeSauce')

  // On trouve une sauce
  Sauces.findOne({_id: req.params.id})
    .then((sauces) => {
      // Si le user id est false et si like === 1
      if (!sauces.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        console.log('sauces + 1')

        // Mise à jour BDD
        Sauces.updateOne(
          {
            // Enregistre l'id de l'utilisateur
            _id: req.params.id,
          },
          {
            // Incrémente like à 1
            $inc: {likes: 1},
            // Ajoute le userId dans le tableau de userLiked
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
        Sauces.updateOne(
          {
            // Enregistre l'id de l'utilisateur
            _id: req.params.id,
          },
          {
            // Retire like
            $inc: {likes: -1},
            // Supprime le userId dans le tableau de userLiked
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
        Sauces.updateOne(
          {
            // Enregistre l'id de l'utilisateur
            _id: req.params.id,
          },
          {
            // Ajoute dislike
            $inc: {dislikes: 1},
            // Supprime le userId dans le tableau de userdisliked
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

        // Mise à jour dans la BDD
        Sauces.updateOne(
          {
            // Enregistre l'id de l'utilisateur
            _id: req.params.id,
          },
          {
            // Retire dislike
            $inc: {dislikes: -1},
            // Supprime le userId dans le tableau de userLiked
            $pull: {usersDisliked: req.body.userId},
          }
        )
          .then(() => res.status(200).json({message: 'usersDisliked  0'}))
          .catch((error) => res.status(400).json({message: error}))
      }
    })

    .catch((error) =>
      res.status(401).json({
        message: error,
      })
    )
}
