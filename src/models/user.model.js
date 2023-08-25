import mongoose from "mongoose";

const userCollection = 'users' //nombre de la coleccion de la db

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email:{
        type: String,
        unique: true
    }
})

export const userMode1 = mongoose.model(userCollection,userSchema, "users");
