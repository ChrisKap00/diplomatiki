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

    console.log(global.onlineUsers);

    const notificationUsers = (await User.find({ groups: groupId })).filter(
      (u) => String(u._id) !== userId
    );
    console.log(notificationUsers.map((u) => u._id));

    for (let i in notificationUsers) {
      notificationUsers[i].notifications.push({
        text: `Ο χρήστης ${userName} δημοσίευσε στην ομάδα ${groupName}.`,
        link: `/group/${groupId}`,
        unread: true,
      });
      await User.findByIdAndUpdate(
        String(notificationUsers[i]._id),
        notificationUsers[i],
        { new: true }
      );
      global.sockets
        .find((socket) => socket.id === onlineUsers.get(userId))
        .to(onlineUsers.get(String(notificationUsers[i]._id)))
        .emit("notification", {
          text: `Ο χρήστης ${userName} δημοσίευσε στην ομάδα ${groupName}.`,
          link: `/group/${groupId}`,
          unread: true,
        });
    }
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

    let type;

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id !== userId);
      type = "unlike";
    } else {
      post.likes.push(userId);
      type = "like";
    }

    await Post.findByIdAndUpdate(postId, post, { new: true });
    res.status(200).json({ error: 0, userId, postId });
    if (userId === post.userId) return;
    if (type === "unlike") return;
    const user = await User.findById(userId);
    const userOfPost = await User.findById(post.userId);
    userOfPost.notifications.push({
      text: `Η δημοσίευσή σας αρέσει στον χρήστη ${user.firstName} ${user.lastName}.`,
      link: `/group/${post.groupId}`,
      unread: true,
    });
    await User.findByIdAndUpdate(post.userId, userOfPost, { new: true });
    global.sockets
      .find((socket) => socket.id === onlineUsers.get(userId))
      .to(onlineUsers.get(String(post.userId)))
      .emit("notification", {
        text: `Η δημοσίευσή σας αρέσει στον χρήστη ${user.firstName} ${user.lastName}.`,
        link: `/group/${post.groupId}`,
        unread: true,
      });
  } catch (error) {
    console.log(error);
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
    if (userId === post.userId) return;
    const userOfPost = await User.findById(post.userId);
    userOfPost.notifications.push({
      text: `Ο χρήστης ${userName} άφησε ένα σχόλιο στη δημοσίευσή σας.`,
      link: `/group/${post.groupId}`,
      unread: true,
    });
    await User.findByIdAndUpdate(post.userId, userOfPost, { new: true });
    global.sockets
      .find((socket) => socket.id === onlineUsers.get(userId))
      .to(onlineUsers.get(String(post.userId)))
      .emit("notification", {
        text: `Ο χρήστης ${userName} άφησε ένα σχόλιο στη δημοσίευσή σας.`,
        link: `/group/${post.groupId}`,
        unread: true,
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
    let commentUserId;
    let type;
    for (let comment of post.comments) {
      if (String(comment._id) === commentId) {
        commentUserId = comment.userId;
        if (comment.likes.includes(userId)) {
          comment.likes = comment.likes.filter((id) => id !== userId);
          type = "unlike";
        } else {
          comment.likes = [...comment.likes, userId];
          type = "like";
        }
        break;
      }
    }
    await Post.findByIdAndUpdate(postId, post, { new: true });
    res.status(200).json({ error: 0 });
    if (userId === commentUserId || type === "unlike") return;
    const user = await User.findById(userId);
    const userOfComment = await User.findById(commentUserId);
    userOfComment.notifications.push({
      text: `Το σχόλιό σας αρέσει στον χρήστη ${user.firstName} ${user.lastName}.`,
      link: `/group/${post.groupId}`,
      unread: true,
    });
    await User.findByIdAndUpdate(commentUserId, userOfComment, { new: true });
    global.sockets
      .find((socket) => socket.id === onlineUsers.get(userId))
      .to(onlineUsers.get(String(commentUserId)))
      .emit("notification", {
        text: `Το σχόλιό σας αρέσει στον χρήστη ${user.firstName} ${user.lastName}.`,
        link: `/group/${post.groupId}`,
        unread: true,
      });
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
    let commentUserId;
    for (let comment of post.comments) {
      if (String(comment._id) === commentId) {
        commentUserId = comment.userId;
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
    if (userId === commentUserId) return;
    const userOfComment = await User.findById(commentUserId);
    userOfComment.notifications.push({
      text: `Ο χρήστης ${userName} απάντησε στο σχόλιό σας.`,
      link: `/group/${post.groupId}`,
      unread: true,
    });
    await User.findByIdAndUpdate(commentUserId, userOfComment, { new: true });
    global.sockets
      .find((socket) => socket.id === onlineUsers.get(userId))
      .to(onlineUsers.get(String(commentUserId)))
      .emit("notification", {
        text: `Ο χρήστης ${userName} απάντησε στο σχόλιό σας.`,
        link: `/group/${post.groupId}`,
        unread: true,
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
    console.log(req.query);
    const post = await Post.findById(postId);
    let replyUserId;
    let type;
    for (let comment of post.comments) {
      // console.log("IN FIRST FOR");
      if (String(comment._id) === commentId) {
        // console.log("IN FIRST IF");
        for (let reply of comment.replies) {
          // console.log("IN SECOND FOR");
          if (String(reply._id) === replyId) {
            replyUserId = reply.userId;
            // console.log("replyUserId: " + replyUserId);
            if (reply.likes.includes(userId)) {
              reply.likes = reply.likes.filter((id) => id !== userId);
              type = "unlike";
            } else {
              reply.likes = [...reply.likes, userId];
              type = "like";
            }
            break;
          }
        }
      }
    }
    await Post.findByIdAndUpdate(postId, post, { new: true });
    res.status(200).json({ error: 0 });
    if (userId === replyUserId || type === "unlike") return;
    const user = await User.findById(userId);
    const userOfReply = await User.findById(replyUserId);
    // console.log(userOfReply);
    userOfReply.notifications.push({
      text: `Η απάντησή σας αρέσει στον χρήστη ${user.firstName} ${user.lastName}.`,
      link: `/group/${post.groupId}`,
      unread: true,
    });
    await User.findByIdAndUpdate(replyUserId, userOfReply, { new: true });
    global.sockets
      .find((socket) => socket.id === onlineUsers.get(userId))
      .to(onlineUsers.get(String(replyUserId)))
      .emit("notification", {
        text: `Η απάντησή σας αρέσει στον χρήστη ${user.firstName} ${user.lastName}.`,
        link: `/group/${post.groupId}`,
        unread: true,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 1 });
  }
});

export default router;
