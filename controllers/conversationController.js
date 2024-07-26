import Conversation from "../models/Conversation.js";

// new conversation

const createConversation = async (req, res) => {
  const senderId = req.body.senderId;
  const receiverId = req.body.receiverId;

  // Check if a conversation already exists with these members
  const existingConversation = await Conversation.findOne({
    members: { $all: [senderId, receiverId] },
  });

  if (existingConversation) {
    console.log("Conversation already exists:", existingConversation._id);
    return res.status(200).json({ message: "Conversation already exists" });
  }

  try {
    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
    console.log("New conversation created successfully", savedConversation);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

// get conversation

const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(err);
  }
};

export { createConversation, getConversation };
