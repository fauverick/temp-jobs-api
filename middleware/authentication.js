const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization   
    if(!authHeader || !authHeader.startsWith('Bearer')){ 
        //the same authentication is used in 05-jwt-basics, all authorization headers begin with Bearer if the token is provided
        throw new UnauthenticatedError('Authentication Invalid')
    }
    const token = authHeader.split(' ')[1]
    
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET) //we decode the token to get the userId and the name
        const {userId, name} = decoded //each user has a name and userId as in the User.methods.createJWT in models/User
        req.user = {userId, name} //attach the user to the job routes
    } catch (error){
        throw new UnauthenticatedError('Authentication Invalid')
    }
    next()
}

module.exports = auth