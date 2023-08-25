import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products:Array
});

export const cartModel = mongoose.model("carts", cartSchema);