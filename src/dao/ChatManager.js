import { messageModel } from "../models/message.model.js";

class ChatManager {
    async getMessages() {
        return await messageModel.find().lean();
    }

    async createMessage(message) {
        await messageModel.create(message);
        return true;
    }
}

export default ChatManager;