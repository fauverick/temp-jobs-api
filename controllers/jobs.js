const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes') 
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async(req, res) => {
    // res.send('get all jobs')
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}

const getJob = async(req, res) => {
    const jobId = req.params.id; //the params is the :id in {{URL}}/jobs/:id
    const userId = req.user.userId; //again, the data of req.user was already attached in middleware/authentication

    const job = await Job.findOne({
        _id: jobId, createdBy: userId
    })

    if(!job) {
        throw new NotFoundError('no job with that id')
    }

    res.status(StatusCodes.OK).json({job})
}

const createJob = async(req, res) => {
   // res.json(req.user) //the data was already attached to req.user in middleware/authentication
   req.body.createdBy = req.user.userId //the data was already attached to req.user in middleware/authentication
//    req.body.name = req.user.name
   const job = await Job.create(req.body)
   res.status(StatusCodes.CREATED).json({job})
}
const updateJob = async(req, res) => {

    const jobId = req.params.id; //the params is the :id in {{URL}}/jobs/:id
    const userId = req.user.userId; //again, the data of req.user was already attached in middleware/authentication
    const {company, position} = req.body;

    if(company === '' || position === '')
    {
        throw new BadRequestError('Company or Position cannot be emptied')
    }

    const job = await Job.findByIdAndUpdate({_id: jobId, createdBy: userId}, req.body, {new: true, runValidators: true})
    res.status(StatusCodes.CREATED).json({job})




}

const deleteJob = async(req, res) => {
    const jobId = req.params.id; //the params is the :id in {{URL}}/jobs/:id
    const userId = req.user.userId; //again, the data of req.user was already attached in middleware/authentication
    const {company, position} = req.body;

    const job = await Job.findByIdAndRemove({_id: jobId, createdBy: userId})

    if(!job){
        throw new NotFoundError(`no job with id of ${jobId}`)
    }
    res.status(StatusCodes.OK).send() //we dont send back data because this is a delete request
    
}

module.exports = {getAllJobs, getJob, createJob, updateJob, deleteJob}