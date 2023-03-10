import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: { user: "chrkap7@gmail.com", pass: "ofnizseqbuqbhbou" },
});
