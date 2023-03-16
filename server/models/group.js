import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
  name: { type: String, required: true },
  users: {
    type: [{ _id: String, firstName: String, lastName: String }],
    default: [],
  },
  posts: {
    type: [
      {
        userName: String,
        userId: String,
        userPfp: String,
        text: String,
        images: [String],
        file: String,
        postedAt: Date,
        likes: [String],
        comments: [
          {
            userName: String,
            userId: String,
            userPfp: String,
            text: String,
            images: [String],
            file: String,
            postedAt: Date,
            like: [String],
          },
        ],
      },
    ],
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
