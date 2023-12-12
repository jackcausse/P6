
// Import de jsonwebtoken
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    // Récupère le token dans le header autorisation: 1er élément bearer, récupère le 2eme élément token
    const token = req.headers.authorization.split(' ')[1]

    // Vérifie que le token récupèré soit le même que le token généré
    const decodedToken = jwt.verify(token, 'SECRET_KEY')
 
    // Récupère l'userId qu'il y a à l'intérieur du token déchiffré et le comparer avec l'user Id non chiffré
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
