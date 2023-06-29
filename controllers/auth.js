const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')

const jwt = require('jsonwebtoken')

const register = async (req, res) => {

    //hash password
    // const {name, email, password} = req.body
    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password, salt)
    // const tempUser = {name, email, password: hashedPassword}

    //we already do the hash password above in the UserSchema in models/User

    const user = await User.create({ ...req.body })

    // const token = jwt.sign({userId: user._id, name: user.name}, 'jwtSecret', {
    //     expiresIn: '30d'
    // })

    //the code above is to create token inside the controller, the code bellow is for we create the token through a method in Model/user and now we import it 
    
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token})
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({email})

    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password) //the password from req.body not the user.password - the user.password comes from the database
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user: {name: user.name}, token
    })
}

module.exports = {register, login}