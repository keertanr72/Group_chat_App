const { ObjectId } = require('mongodb');

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Group = require('../models/group')

const { send } = require('process')

// geting users for frontend

exports.getUsersExceptSelf = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } })
        res.json({ users })
    } catch (error) {
        console.log(error)
    }
}

// getting users to add to group

exports.getNewUsersExceptSelf = async (req, res) => {
    try {
        const groupId = req.query.groupId
        const presentUserIds = await Group.findById(groupId)
        const users = await User.find({ _id: { $nin: presentUserIds.userIds } })
        // console.log(users)
        res.json({ users })
    } catch (error) {
        console.log(error)
    }
}

// checking if email exists

exports.checkUser = async (req, res, next) => {
    try {
        const email = req.body.email
        const userDetails = await User.findOne({ email })
        if (userDetails) {
            res.status(404).send({ message: 'user exists', success: false })
        }
        else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

exports.createUser = async (req, res) => {
    try {
        const { userName, email, phoneNumber, password } = req.body
        const saltRounds = 10
        bcrypt.hash(password, saltRounds, async (error, hash) => {
            if (error) {
                console.error('Error hashing password:', error);
            } else {
                const user = new User({
                    userName, 
                    email, 
                    phoneNumber, 
                    password: hash
                })
                await user.save()
            }
        })
        res.json({ success: true })
    } catch (error) {
        console.log(error)
    }
}

const generateToken = (userDetails) => {
    return jwt.sign({ userDetails }, 'secretKey')
}

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const userDetails = await User.findOne({ email })
        if (!userDetails) {
            res.status(403).send({ message: "user doesn't exists", success: false })
        } else {
            bcrypt.compare(password, userDetails.password, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    if (result)
                        res.status(200).send({ message: "user exists", success: true, token: generateToken(userDetails) })
                    else
                        res.status(404).send({ message: "wrong password", success: false })
                }
            });
        }
    } catch (error) {
        console.log(error)
    }
}

// checking if user is admin to display admin buttons in frontend

exports.checkAdminStatus = async (req, res) => {
    const userData = await Group.findOne({ _id: new ObjectId(req.query.currentTextingPerson), admins: new ObjectId(req.user._id) })
    res.json({ userData })
}