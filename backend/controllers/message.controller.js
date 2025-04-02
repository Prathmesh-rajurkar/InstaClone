import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const recieverId = req.params.id;
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recieverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      recieverId,
      message,
    });
    if (newMessage) conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    // implementing socket io for real time data transfer

    return res.status(200).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const recieverId = req.params.id;

    const conversation = await Conversation.find({
      participants: { $all: [senderId, recieverId] },
    });
    if (!conversation)
      return res
        .status(200)
        .json({success: true, messages: [] });

    return res.status(200).json({
      success: true,
      messages: conversation?.messages,
    });
    
  } catch (error) {
    console.log(error);
  }
};
