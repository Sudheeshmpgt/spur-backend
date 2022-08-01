const MessageModel = require('../model/messageSchema');

const messages = async (req, res) => {
    const newMessage = new MessageModel(req.body);
    try {
        const savedMessage = await newMessage.save();
        res.send({ message: "Message created successfully", message: savedMessage });
    } catch (error) {
        res.status(500).send(error);
    }
}

const getMessages = async (req, res) => {
    try {
        const messages = await MessageModel.find({ conversationId: req.params.id });
        res.send({ message: messages });
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}

module.exports = { messages, getMessages }