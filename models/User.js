const mongoose = require('mongoose')
const bcrypt = require('bcryptjs') //BYCRYPTJS NOT BYCRYPT
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minlength: 3,
        maxlength: 50,

    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [ 
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
        // maxlength: 12,

    }
})

//using the bellow middleware to hash password, this is easier to work with & look at

UserSchema.pre('save', async function(){  //ALWAYS USE THE FUNCTION KEYWORD HERE TO USE THE THIS. KEYWORD BELOW
    const salt = await  bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt) //this.password refers to the password of the object that is currently using the User model
})

//using the bellow middleware to create token
UserSchema.methods.createJWT = function() {
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    } )
}

//compares the password from the user's input and the password in our databse during the login process
UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)
