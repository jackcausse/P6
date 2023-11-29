// Importation
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    // Récupere le token dans le header autorization: bearer token
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
  //  Récupère l'userId qu'il y a à l'intérieur du token déchifré et le comparer avec l'user Id non chiffré
    const userId = decodedToken.userId
    // Comparaison de l'userId dans la request avec l'userId du token
    req.auth = {
      userId: userId,
    }
    next()
  } catch (error) {
    res.status(401).json({error})
  }
}
