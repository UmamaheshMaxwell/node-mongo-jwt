import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

import { mongoURL } from "./src/config/db.js"
import { User } from "./src/models/user.js"
import { verifyToken } from "./src/verifyToken.js"

const app = express()
const router = express.Router()

app.use(cors())
app.use(express.json())
app.use(morgan("combined"))
// Set up Global configuration access
dotenv.config();


mongoose.connect(mongoURL)
    .then(() => console.log(`Connected to MongoDB Successfully`))
    .catch(err => console.log(err))

router.get("/", (req, res) => {
    res.json("NodeJS API Authentication using MongoDB and JWT !!!")
})

router.post("/register",(req, res) => {
    const {username, email, password} = req.body
    const salt = parseInt(process.env.SALT_ROUNDS)
    bcrypt.hash(password, salt, async (err, hash) => {
        if(err){
            res.status(401).send(err)
        }
       const usrObj =  new User({username, email, password: hash})
       await usrObj.save()
       res.json("User Registered Successfully !!! ")
    })
})

router.post("/login", async (req, res) => {
    const {username, password} = req.body
    const userObj = await User.find({username})

    if(userObj.length > 0) {
        bcrypt.compare(password, userObj[0].password, (err, isValidUser) => {
            if(err) {
                res.status(401).send(err)
            } else {
                if(isValidUser){
                    const secret = process.env.JWT_SECRET_KEY
                    const data = { time: Date(),userId: userObj[0]._id}
                    const token = jwt.sign(data, secret, {expiresIn : "1h"})
                    res.json(token)
                } else {
                    res.status(401).send("Login has failed")
                }
            }
        })
    } else {
        res.json("Login has failed ")
    }
})

router.get("/users", verifyToken , async(req, res) => {
    const users = await User.find()
    res.json(users)
})

const PORT = 3001

app.use("/api", router)

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`)
})