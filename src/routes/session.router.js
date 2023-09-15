import express from "express";
import UserManager from "../dao/UserManager.js";

const router = express.Router();
const UM = new UserManager();

router.get("/login", async (req, res) => {
    console.log(`req.query: ${JSON.stringify(req.query)}`);
    let {user, pass} = req.query;
    const userLogged = await UM.login(user, pass, req); 

    if (userLogged) {
        res.send({status:"OK", message:userLogged});
    } else {
        console.log('Fallo al loguear en el servidor');
        res.status(401).send({status:"Error", message:"No se pudo loguear el Usuario!"});
    }
    console.log(`res.status: ${res.statusCode}`);
});

router.post("/register", async (req, res) => {
    const userRegistered = await UM.addUser(req.body);

    if (userRegistered) {
        res.send({status:"OK", message:userRegistered});
    } else {
        res.status(401).send({status:"Error", message:"No se pudo registrar el Usuario!"});
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy(err => {
      if(err) {
        return res.redirect('/profile');
      }
        res.redirect('/login');
    });
  });

export default router;