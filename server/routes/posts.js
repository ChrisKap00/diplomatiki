import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Post from "../models/post.js";
import User from "../models/user.js";

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
    const user = await User.findById(userId);
    user.posts.push({ postId: result._id, groupId });
    await User.findByIdAndUpdate(userId, user, { new: true });
    res.status(200).json({ error: 0, postId: result._id, postedAt });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.post("/fetch", async (req, res) => {
  // console.log(req.body);
  try {
    const { userId, groups, page, groupId, profileId, search } = req.body;
    console.log(req.body);
    if (groups) {
      let posts = [];
      const existingPosts = await Post.find({});
      for (let post of existingPosts) {
        if (groups.includes(post.groupId)) {
          posts.push(post);
        }
      }
      posts.sort((post1, post2) => post2.postedAt - post1.postedAt);
      const postsTemp = posts.map((post) => String(post._id));
      const postsToSend = posts.splice(page * 5, 5);
      if (postsToSend.length === 0)
        return res.status(200).json({ error: 0, posts: [], last: true });
      // console.log(
      //   postsToSend.map((post) => ({ text: post.text, _id: post._id })),
      //   postsTemp,
      //   page
      // );
      res.status(200).json({
        error: 0,
        posts: postsToSend,
        last:
          String(postsToSend[postsToSend.length - 1]._id) ===
          postsTemp[postsTemp.length - 1],
      });
    } else if (groupId && !search) {
      let posts = await Post.find({ groupId });
      posts.sort((post1, post2) => post2.postedAt - post1.postedAt);
      const postsTemp = posts.map((post) => String(post._id));
      const postsToSend = posts.splice(page * 5, 5);
      if (postsToSend.length === 0)
        return res.status(200).json({ error: 0, posts: [], last: true });
      // console.log(
      //   postsToSend.map((post) => ({ text: post.text, _id: post._id })),
      //   postsTemp,
      //   page
      // );
      res.status(200).json({
        error: 0,
        posts: postsToSend,
        last:
          String(postsToSend[postsToSend.length - 1]._id) ===
          postsTemp[postsTemp.length - 1],
      });
    } else if (groupId && search) {
      let posts = await Post.find({ groupId, text: RegExp(search, "i") });
      posts.sort((post1, post2) => post2.postedAt - post1.postedAt);
      const postsTemp = posts.map((post) => String(post._id));
      const postsToSend = posts.splice(page * 5, 5);
      if (postsToSend.length === 0)
        return res.status(200).json({ error: 0, posts: [], last: true });
      // console.log(
      //   postsToSend.map((post) => ({ text: post.text, _id: post._id })),
      //   postsTemp,
      //   page
      // );
      res.status(200).json({
        error: 0,
        posts: postsToSend,
        last:
          String(postsToSend[postsToSend.length - 1]._id) ===
          postsTemp[postsTemp.length - 1],
      });
    } else if (profileId) {
      let posts = await Post.find({ userId: profileId });
      posts.sort((post1, post2) => post2.postedAt - post1.postedAt);
      const postsTemp = posts.map((post) => String(post._id));
      const postsToSend = posts.splice(page * 5, 5);
      if (postsToSend.length === 0)
        return res.status(200).json({ error: 0, posts: [], last: true });
      // console.log(
      //   postsToSend.map((post) => ({ text: post.text, _id: post._id })),
      //   postsTemp,
      //   page
      // );
      res.status(200).json({
        error: 0,
        posts: postsToSend,
        last:
          String(postsToSend[postsToSend.length - 1]._id) ===
          postsTemp[postsTemp.length - 1],
      });
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

router.patch("/deleteComment", async (req, res) => {
  console.log(req.query);
  const { postId, commentId } = req.query;
  try {
    const post = await Post.findById(postId);
    let postedAt;
    for (let comment of post.comments) {
      if (String(comment._id) === commentId) {
        comment.deleted = true;
        comment.text = "";
        comment.images = [];
        comment.file = null;
        postedAt = comment.postedAt;
        // comment.likes = comment.likes.includes(userId)
        //   ? comment.likes.filter((id) => id !== userId)
        //   : [...comment.likes, userId];
        break;
      }
    }
    await Post.findByIdAndUpdate(postId, post, { new: true });
    res.status(200).json({ error: 0, postedAt });
  } catch (error) {
    res.status(500).json({ error: 1, postId, commentId });
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

router.post("/reply", async (req, res) => {
  try {
    const { userId, userName, userPfp, postId, commentId, reply } = req.body;
    const post = await Post.findById(postId);
    const postedAt = new Date();
    for (let comment of post.comments) {
      if (String(comment._id) === commentId) {
        comment.replies.push({
          userName,
          userId,
          userPfp,
          text: reply.text,
          images: reply.images,
          file: reply.file,
          postedAt,
          likes: [],
          replies: [],
        });
        break;
      }
    }
    const updatedPost = await Post.findByIdAndUpdate(postId, post, {
      new: true,
    });
    res.status(200).json({
      error: 0,
      replyId: updatedPost.comments
        .filter((comment) => String(comment._id) === commentId)[0]
        .replies.filter(
          (reply) => String(reply.postedAt) === String(postedAt)
        )[0]._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 1 });
  }
});

router.patch("/deleteReply", async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.query;
    const post = await Post.findById(postId);
    let postedAt;
    for (let comment of post.comments) {
      if (String(comment._id) === commentId) {
        for (let reply of comment.replies) {
          if (String(reply._id) === replyId) {
            reply.deleted = true;
            reply.text = "";
            reply.images = [];
            reply.file = null;
            postedAt = reply.postedAt;
          }

          // comment.likes = comment.likes.includes(userId)
          //   ? comment.likes.filter((id) => id !== userId)
          //   : [...comment.likes, userId];
          break;
        }
      }
    }
    await Post.findByIdAndUpdate(postId, post, { new: true });
    res.status(200).json({ error: 0, postedAt });
  } catch (error) {
    res.status(500).json({ error: 1 });
  }
});

router.patch("/likeReply", async (req, res) => {
  try {
    const { userId, postId, commentId, replyId } = req.query;
    const post = await Post.findById(postId);
    for (let comment of post.comments) {
      if (String(comment._id) === commentId) {
        for (let reply of comment.replies) {
          if (String(reply._id) === replyId) {
            reply.likes = reply.likes.includes(userId)
              ? reply.likes.filter((id) => id !== userId)
              : [...reply.likes, userId];
          }
          break;
        }
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
