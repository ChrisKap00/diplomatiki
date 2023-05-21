import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Group from "../models/group.js";
import User from "../models/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// router.post("/signin", signin);
router.post("/create", async (req, res) => {
  if (!auth(req)) return res.status(500).json({ message: "Invalid token" });

  console.log(req.body);
  const {
    groupData: { code, name },
    user,
  } = req.body;

  try {
    if (await Group.findOne({ code })) {
      return res.status(500).json({
        error: 1,
        message: `Υπάρχει ήδη όμαδα με κωδικό μαθήματος ${code}.`,
      });
    } else if (await Group.findOne({ name })) {
      return res.status(500).json({
        error: 1,
        message: `Υπάρχει ήδη όμαδα με όνομα μαθήματος ${name}.`,
      });
    }
    const result = await Group.create({
      code,
      name,
      users: [user],
    });
    const oldUser = await User.findById(user._id);
    oldUser.groups.push(result._id);
    const newUser = await User.findByIdAndUpdate(user, oldUser, { new: true });
    return res.status(200).json({
      error: 0,
      message: `Η ομάδα ${code} - ${name} δημιουργήθηκε επιτυχώς.`,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 1, message: "Κάτι πήγε στραβά" });
  }
});

router.get("/fetchGroups", async (req, res) => {
  if (!auth(req)) return res.status(500).json({ message: "Invalid token" });
  
  try {
    const groups = await Group.find({});
    for (let group of groups) {
      group.posts = undefined;
      for (let user of group.users) {
        user.pfp = undefined;
      }
    }
    return res.status(200).json({ error: 0, groups });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 1 });
  }
});

router.patch("/follow", async (req, res) => {
  if (!auth(req)) return res.status(500).json({ message: "Invalid token" });
  
  try {
    console.log(req.query);
    const { userId, firstName, lastName, pfp, groupId } = req.query;
    const group = await Group.findById(groupId);
    const user = await User.findById(userId);
    if (!group) {
      return res.status(500).json({
        error: 1,
        message: "Η ομάδα δεν υπάρχει.",
      });
    }
    let type;
    if (group.users.findIndex((e) => e._id === userId) > -1) {
      group.users = group.users.filter((e) => e._id !== userId);
      user.groups = user.groups.filter((e) => e !== groupId);
      type = "rmv";
    } else {
      group.users.push({ _id: userId, firstName, lastName, pfp });
      user.groups.push(groupId);
      type = "add";
    }

    await Group.findByIdAndUpdate(groupId, group, {
      new: true,
    });
    await User.findByIdAndUpdate(userId, user, { new: true });

    return res.status(200).json({
      error: 0,
      type,
      groupId,
      userId,
      firstName,
      lastName,
      pfp: pfp === "undefined" ? undefined : pfp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 1 });
  }
});

export default router;
