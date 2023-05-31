import express from "express";

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
    }
    return res.status(200).json({ error: 0, groups });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 1 });
  }
});

router.patch("/follow", async (req, res) => {
  console.log("HERE");
  if (!auth(req)) return res.status(500).json({ message: "Invalid token" });

  try {
    console.log(req.query);
    const { userId, groupId } = req.query;
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
      group.users.push({
        _id: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        pfp: user.pfp,
      });
      user.groups.push(groupId);
      type = "add";
    }

    await Group.findByIdAndUpdate(groupId, group, {
      new: true,
    });
    await User.findByIdAndUpdate(userId, user, { new: true });

    res.status(200).json({
      error: 0,
      type,
      groupId,
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      pfp: user.pfp,
    });

    if (type === "rmv") return;

    const notificationUsers = (await User.find({ groups: groupId })).filter(
      (u) => String(u._id) !== userId
    );
    console.log(notificationUsers.map((u) => u._id));

    for (let i in notificationUsers) {
      notificationUsers[i].notifications.push({
        text: `Ο χρήστης ${user.firstName} ${user.lastName} μπήκε στην ομάδα ${group.code}-${group.name}.`,
        link: `/group/${group._id}`,
        unread: true,
      });
      await User.findByIdAndUpdate(String(notificationUsers[i]._id), notificationUsers[i], {
        new: true,
      });
      global.sockets
        .find((socket) => socket.id === onlineUsers.get(userId))
        .to(onlineUsers.get(String(notificationUsers[i]._id)))
        .emit("notification", {
          text: `Ο χρήστης ${user.firstName} ${user.lastName} μπήκε στην ομάδα ${group.code}-${group.name}.`,
          link: `/group/${group._id}`,
          unread: true,
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 1 });
  }
});

export default router;
