const { StatusCodes } = require('http-status-codes')
const { custom } = require('joi')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //setting the default value for statusCode or message of error
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later'
  }
 
  if(err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(', ')  //Use this to display shit like Please provide email, Please provide username
  }

  if(err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }

  if(err.code && err.code == 11000){  // to use when values are duplicated (in this case, it's the emails when register user)
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value` //use Object.keys to display the name of the field, otherwise it will be [Object object]
    customError.statusCode = 400
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })

}

module.exports = errorHandlerMiddleware


//THIS WHOLE VALIDATION ERRROR MESS IS IN LESSON 194 - 196
