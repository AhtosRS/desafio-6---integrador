import ChatManager from "../dao/ChatManager.js";
import { Router } from "express";

const chatRouter = Router();

chatRouter.post("/", async (req, res) => {
    let {user, message} = req.body;
	try {
		const chat = new ChatManager();

		const addChat = await chat.createMessage({user, message});
		res.status(200).send(addChat);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

chatRouter.get("/", async (req, res) => {
	try {
		const chat = new ChatManager();
		const getChats = await chat.getMessages();
		res.status(200).send(getChats);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

export default chatRouter;