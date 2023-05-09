import express from "express";

import User from "../models/user.js";

const router = express.Router();

router.get("/fetchMessages", async (req, res) => {
  console.log(req.query);
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);
    res.status(200).json({ error: 0, messages: user.messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 1 });
  }
});

router.post("/sendMessage", async (req, res) => {
  const { senderId, receiverId, message, fetchChat } = req.body;
  console.log(req.body);
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    const sentAt = new Date();
    let counter;
    // console.log(sender);
    const senderChat = sender.messages.find(
      (chat) => chat.withId === receiverId
    );
    if (!senderChat) {
      sender.messages.push({
        withId: receiverId,
        withName: `${receiver.firstName} ${receiver.lastName}`,
        withPfp: receiver.pfp,
        data: [
          {
            senderId: senderId,
            text: message.text,
            image: message.image,
            file: message.file,
            sentAt,
            counter: 0,
          },
        ],
      });
      counter = 0;
    } else {
      counter = senderChat.data.length;
      senderChat.data.push({
        senderId: senderId,
        text: message.text,
        image: message.image,
        file: message.file,
        sentAt,
        counter: senderChat.data.length,
      });
    }
    await User.findByIdAndUpdate(senderId, sender, { new: true });

    const receiverChat = receiver.messages.find(
      (chat) => chat.withId === senderId
    );
    if (!senderChat) {
      counter = 0;
      receiver.messages.push({
        withId: senderId,
        withName: `${sender.firstName} ${sender.lastName}`,
        withPfp: sender.pfp,
        data: [
          {
            senderId: senderId,
            text: message.text,
            image: message.image,
            file: message.file,
            sentAt,
            counter: 0,
          },
        ],
      });
    } else {
      counter = senderChat.data.length;
      receiverChat.data.push({
        senderId: senderId,
        text: message.text,
        image: message.image,
        file: message.file,
        sentAt,
        counter: receiverChat.data.length,
      });
    }
    await User.findByIdAndUpdate(receiverId, receiver, { new: true });
    const resObj =
      // fetchChat
      //   ? { error: 0, chat: sender.messages.find((c) => c.withId === receiverId) }
      //   :
      { error: 0, sentAt, counter };
    res.status(200).json(resObj);
  } catch (error) {
    console.log(error);
    console.log(error);
    res.status(500).json({ error: 1 });
  }
});

router.get("/fetchInfoForChat", async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);
    res.status(200).json({
      error: 0,
      pfp: user.pfp,
      name: `${user.firstName} ${user.lastName}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 1 });
  }
});

export default router;