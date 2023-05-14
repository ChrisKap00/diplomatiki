import express from "express";

import Post from "../models/post.js";
import User from "../models/user.js";

const router = express.Router();

router.post("/changePfp", async (req, res) => {
  console.log(req.body);
  try {
    const { userId, pfp } = req.body;
    const user = await User.findById(userId);
    user.pfp = pfp;
    await User.findByIdAndUpdate(userId, user, { new: true });
    const posts = await Post.find({ userId });
    for (let i in posts) {
      posts[i].userPfp = pfp;
      posts[i].comments = posts[i].comments.map((comment) => ({
        ...comment,
        userPfp: comment.userId === userId ? pfp : comment.userPfp,
        replies: comment.replies.map((reply) => ({
          ...reply,
          userPfp: reply.userId === userId ? pfp : reply.userPfp,
        })),
      }));
    }
    for (let i in posts) {
      await Post.findByIdAndUpdate(posts[i]._id, posts[i], { new: true });
    }
    res.status(200).json({ error: 0 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 1 });
  }
});

router.get("/fetchProfileInfo", async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);
    res.status(200).json({
      error: 0,
      pfp: user.pfp,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 1 });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    console.log(query);
    User.aggregate([
      {
        $project: {
          name: { $concat: ["$firstName", " ", "$lastName"] },
          pfp: "$pfp",
        },
      },
      {
        $match: { name: RegExp(query, "i") },
      },
    ]).exec((error, result) => {
      return res.status(200).json({ error: 0, users: result.splice(0, 24) });
    });
    // res.status(200).json({
    //   error: 0,
    //   users: users
    //     .map((user) => ({
    //       _id: user._id,
    //       name: `${user.firstName} ${user.lastName}`,
    //       pfp: user.pfp,
    //     }))
    //     .splice(0, 24),
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 1 });
  }
});

router.patch("/readNotifications", async (req, res) => {
  try {
    const { userId } = req.query;
    console.log(userId);
    const user = await User.findById(userId);
    for (let notification of user.notifications) {
      notification.unread = false;
    }
    await User.findByIdAndUpdate(userId, user, { new: true });
    res.status(200).json({ error: 0 });
  } catch (error) {
    res.status(500).json({ error: 1 });
  }
});

router.get("/fetchNotifications", async (req, res) => {
  try {
    const { userId } = req.query;
    // console.log(userId);
    const user = await User.findById(userId);
    // for (let notification of user.notifications) {
    //   notification.unread = false;
    // }
    // await User.findByIdAndUpdate(userId, user, { new: true });
    res.status(200).json({ error: 0, notifications: user.notifications });
  } catch (error) {
    res.status(500).json({ error: 1 });
  }
});

export default router;
