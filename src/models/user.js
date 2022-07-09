import mongoose from "mongoose";
const {Schema} = mongoose

const userSchema = new Schema({
    username: String,
    email: String, 
    password: String
}, {versionKey: false})

export const User = mongoose.model("user", userSchema, "user")
