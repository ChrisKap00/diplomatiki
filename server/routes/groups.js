import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Group from "../models/group.js";

const router = express.Router();

// router.post("/signin", signin);
router.post("/create", async (req, res) => {
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
  try {
    const groups = await Group.find({});
    return res.status(200).json({ error: 0, groups });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 1 });
  }
});

export default router;

router.patch("/follow", async (req, res) => {
  try {
    console.log(req.query);
    const { userId, firstName, lastName, pfp, groupId } = req.query;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(500).json({
        error: 1,
        message: "Η ομάδα δεν υπάρχει.",
      });
    }
    let type;
    if (group.users.findIndex((e) => e._id === userId) > -1) {
      group.users = group.users.filter((e) => e._id !== userId);
      type = "rmv";
    } else {
      group.users.push({ _id: userId, firstName, lastName, pfp });
      type = "add";
    }
    const updatedGroup = await Group.findByIdAndUpdate(groupId, group, {
      new: true,
    });
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
