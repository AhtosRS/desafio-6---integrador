import { Router } from "express";
import { userMode1 } from "../models/user.model.js";


export const router = Router();

router.get('/', async(req,res)=>{
    try{
        let user = await userMode1.find()
        res.send({result:"success", payload:user})
    }
    catch(error){
        console.log("cannot get user with mongoose: "+error)
    }
})

router.post('/', async(req,res)=>{
    let {first_name, last_name, email} = req.body;
    if(!first_name||!last_name||!email) return res.send({status:"error",error:"incomplete values"});
    let result = await userMode1.create({
        first_name,
        last_name,
        email
    });
    res.send({status:"success", payload:result})
})

router.put('/:uid', async(req,res)=>{
    let {uid} = req.params; //obtenemos el user id del param
    let userToReplace = req.body;
    if(!userToReplace.first_name||!userToReplace.last_name||!userToReplace.email){
        return res.send({status:"error", error: "incomplete values"})
    }
    let result = await userMode1.updateOne({_id:uid},userToReplace)
    res.send({status:"success", payload:result})
})

router.delete('/:uid', async(req,res)=>{
    let{uid}=req.params;
    let result = await userMode1.deleteOne({_id:uid})
    res.send({status:"success", payload:result})
})
 