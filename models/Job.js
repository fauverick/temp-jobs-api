const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide position'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User', //refer to the User Model
        required: [true, 'Please provide user']
    },
    // name: {
    //     type: String,
    //     ref: 'User', //refer to the User Model
    //     required: [true, 'Please provide name']
    // }
}, {timestamps: true})

module.exports = mongoose.model('Job', jobSchema)