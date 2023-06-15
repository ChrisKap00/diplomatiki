import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

import { transporter } from "../transporter.js";

const router = express.Router();

// router.post("/signin", signin);
router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email, password, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(500).json({
        error: 1,
        message: `Η ηλεκτρονική διεύθυνση χρησιμοποιείται ήδη.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    const verificationURL = `http://localhost:3000/verification/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Email Verification",
      html: `Πατήστε τον παρακάτω σύνδεσμο για να επιβεβαιώσετε την ηλεκτρονική διεύθυνση:\n\n<a href="${verificationURL}">${verificationURL}</a>\n\nΟ σύνδεσμος λήγει σε 24 ώρες.`,
    });

    res.status(200).json({
      error: 0,
      message: "Έχει σταλεί email επιβεβαίωσης της ηλεκτρονικής διεύθυνσης.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 1, message: "Κάτι πήγε στραβά" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(500).json({
        error: 1,
        message: "Δεν υπάρχει λογαριασμός με αυτή την ηλεκτρονική διεύθυνση.",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      // console.log(bcrypt.decodeBase64(existingUser.password));
      return res.status(500).json({ error: 1, message: "Ο κωδικός είναι λανθασμένος." });
    }

    if (!existingUser.verified) {
      const token = jwt.sign({ email, id: existingUser._id }, process.env.JWT_KEY, {
        expiresIn: "1d",
      });

      const verificationURL = `${process.env.VERIFICATION_URL}${token}`;

      await transporter.sendMail({
        to: email,
        subject: "Email Verification",
        html: `Πατήστε τον παρακάτω σύνδεσμο για να επιβεβαιώσετε την ηλεκτρονική διεύθυνση:\n\n<a href="${verificationURL}">${verificationURL}</a>\n\nΟ σύνδεσμος λήγει σε 24 ώρες.`,
      });

      return res.status(500).json({
        error: 1,
        message:
          "Η ηλεκτρονική διεύθυνση δεν είναι επαληθευμένη. Έχει σταλεί νέο email επαλήθευσης.",
      });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_KEY
    );
    existingUser.verified = undefined;
    return res.status(200).json({ result: existingUser, token: token });
  } catch (error) {
    return res.status(500).json({ error: 1, message: "Κάτι πήγε στραβά." });
  }
});

router.get("/verification/:token", async (req, res) => {
  let tokenObj;
  try {
    tokenObj = jwt.verify(req.params.token, process.env.JWT_KEY);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: -1, message: "Ο σύνδεσμος έχει λήξει" });
  }

  try {
    const existingUser = await User.findOne({ _id: tokenObj.id });
    if (!existingUser) {
      return res.status(500).json({
        error: 1,
        message: `Δεν υπάρχει λογαριασμός με αυτή την ηλεκτρονική διεύθυνση.`,
      });
    } else if (existingUser.verified) {
      return res.status(500).json({
        error: -1,
        message: "Η ηλεκτρονική διεύθυνση είναι ήδη επιβεβαιωμένη.",
      });
    }
    await User.findByIdAndUpdate(tokenObj.id, { verified: true });
    return res.status(200).json({
      error: 1,
      message: "Η ηλεκτρονική διεύθυνση επαληθεύτηκε επιτυχώς. Μπορείτε να κλείσετε το παράθυρο.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: -1, message: "Κάτι πήγε στραβά." });
  }
});

export default router;
