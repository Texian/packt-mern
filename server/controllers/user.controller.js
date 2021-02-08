import User from '../models/user.model.js'
import extend from 'lodash/extend.js' //JS library of utility functions
import dbErrorHandler from '../helpers/dbErrorHandler.js'

const create = async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        if (!user)
        return res.status('400').json({
            error: "User not found"
            })
        req.profile = user
        next() //After user object is found and appended, next() starts the next relevant controller function
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve user"
        })
    }
}

const read = (req, res) => {
    //remove sensitive information first
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

const list = async (req, res) => {
    try {
        let users = await User.find().select('name email updated created')
        res.json(users)
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

const update = async (req, res) => {
    try {
        let user = req.profile
        user = extend(user, req.body) //lodash merges data sent in the req.body with the database
        user.updated = Date.now()
        await user.save()
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

const remove = async (req, res) => {
    try {
        let user = req.profile
        let deletedUser = await user.remove()
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

export default {
    create,
    list,
    userByID,
    read,
    update,
    remove
}