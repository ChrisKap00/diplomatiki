import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Group from "../models/group.js";

const router = express.Router();

router.post("/post", async (req, res) => {
  console.log(req.body);
});

export default router;
