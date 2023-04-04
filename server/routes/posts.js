import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Post from "../models/post.js";

const router = express.Router();

router.post("/post", async (req, res) => {
  console.log(req.body);
  try {
    const {
      userId,
      userName,
      userPfp,
      groupId,
      groupName,
      text,
      images,
      file,
    } = req.body;

    const postedAt = new Date();

    const result = await Post.create({
      userId,
      userName,
      userPfp,
      groupId,
      groupName,
      text,
      images,
      file,
      postedAt,
    });
    res.status(200).json({ error: 0, postId: result._id, postedAt });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.post("/fetch", async (req, res) => {
  // console.log(req.body);
  try {
    const { userId, groups, page, groupId, profileId } = req.body;
    if (groups) {
      let posts = [];
      const existingPosts = await Post.find({});
      for (let post of existingPosts) {
        if (groups.includes(post.groupId)) {
          posts.push(post);
        }
      }
      posts.sort((post1, post2) => post2.postedAt - post1.postedAt);
      posts = posts.splice(page, page + 5);
      // console.log(posts.splice(page, page + 5));
      res.status(200).json({ error: 0, posts });
    } else if (groupId) {
      let posts = await Post.find({ groupId });
      posts.sort((post1, post2) => post2.postedAt - post1.postedAt);
      posts = posts.splice(page, page + 5);
      res.status(200).json({ error: 0, posts });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 1 });
  }
});

router.delete("/delete", async (req, res) => {
  console.log(req.query);
  const { postId } = req.query;
  try {
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ error: 0, postId });
  } catch (error) {
    res.status(500).json({ error: 1, postId });
  }
});

export default router;
