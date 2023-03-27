import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  users: {
    type: [{ _id: String, firstName: String, lastName: String, pfp: String }],
    required: true,
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

const Group = mongoose.model("Group", groupSchema);

export default Group;
