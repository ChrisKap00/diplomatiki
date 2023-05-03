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

export default router;
