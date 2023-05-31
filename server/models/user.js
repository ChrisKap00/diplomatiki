import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  pfp: { type: String, required: false },
  verified: { type: Boolean, default: false },
  groups: { type: [String], default: [] },
  messages: {
    type: [
      {
        withId: String,
        withName: String,
        withPfp: String,
        data: [
          {
            senderId: String,
            text: String,
            image: String,
            file: {
              type: new Schema({
                base64: String,
                name: String,
                type: String,
                size: String,
              }),
              required: false,
            },
            sentAt: String,
            counter: String,
          },
        ],
      },
    ],
    default: [],
  },
  notifications: {
    type: [{ text: String, link: String, unread: Boolean }],
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
