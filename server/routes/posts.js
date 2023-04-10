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

router.patch("/like", async (req, res) => {
  console.log(req.query);
  try {
    const { userId, postId } = req.query;

    const post = await Post.findById(postId);

    if (post.likes.includes(userId))
      post.likes = post.likes.filter((id) => id !== userId);
    else post.likes.push(userId);

    await Post.findByIdAndUpdate(postId, post, { new: true });
    res.status(200).json({ error: 0, userId, postId });
  } catch (error) {
    res.status(500).json({ error: 1 });
  }
});

router.post("/comment", async (req, res) => {
  try {
    const { userId, userName, userPfp, postId, comment } = req.body;
    console.log(req.body);

    const post = await Post.findById(postId);
    const postedAt = new Date();
    post.comments.push({
      userName,
      userId,
      userPfp,
      text: comment.text,
      images: comment.images,
      file: comment.file,
      postedAt,
      likes: [],
      replies: [],
    });
    const updatedPost = await Post.findByIdAndUpdate(postId, post, {
      new: true,
    });
    console.log(updatedPost);
    res.status(200).json({
      error: 0,
      commentId: updatedPost.comments.filter(
        (comment) => String(comment.postedAt) === String(postedAt)
      )[0]._id,
      postedAt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 1 });
  }
});

router.patch("/likeComment", async (req, res) => {
  console.log(req.query);
  try {
    const { userId, postId, commentId } = req.query;
    const post = await Post.findById(postId);
    for (let comment of post.comments) {
      if (String(comment._id) === commentId) {
        comment.likes = comment.likes.includes(userId)
          ? comment.likes.filter((id) => id !== userId)
          : [...comment.likes, userId];
        break;
      }
    }
    await Post.findByIdAndUpdate(postId, post, { new: true });
    res.status(200).json({ error: 0 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 1 });
  }
});

export default router;
