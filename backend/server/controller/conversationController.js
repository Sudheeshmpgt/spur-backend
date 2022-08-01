const ConversationModel = require('../model/conversationSchema');

const conversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        console.log(senderId, receiverId)
        const prevRecord = await ConversationModel.findOne({ members: { $eq: [senderId, receiverId] } })
        console.log('PR', prevRecord)
        if (!prevRecord) {
            const newConversation = new ConversationModel({
                members: [senderId, receiverId],
            });
            const savedConversation = await newConversation.save();
            res.send({ message: "Conversation created successfully", conversation: savedConversation });
        } else {
            res.send({ message: "Conversation already exists", conversation: prevRecord });
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

const getConversations = async (req, res) => {
    try {
        const conversation = await ConversationModel.find({
            members: { $in: [req.params.id] },
        })
        res.send({ conversation: conversation });
    } catch (error) {

    }
}

module.exports = { conversation, getConversations };