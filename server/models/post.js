import mongoose, { Schema } from "mongoose";

const postSchema = mongoose.Schema({
  userName: { type: String, required: true },
  userId: { type: String, required: true },
  userPfp: { type: String },
  groupId: { type: String, required: true },
  groupName: { type: String, required: true },
  text: { type: String },
  images: { type: [String] },
  file: {
    type: new Schema({
      base64: String,
      name: String,
      type: String,
      size: String,
    }),
    required: false,
  },
  postedAt: { type: Date, required: true },
  likes: { type: [String], default: [] },
  comments: {
    type: [
      new Schema({
        userName: String,
        userId: String,
        userPfp: String,
        text: String,
        images: [String],
        file: {
          type: new Schema({
            base64: String,
            name: String,
            type: String,
            size: String,
          }),
          required: false,
        },
        postedAt: Date,
        deleted: { type: Boolean, default: false },
        likes: [String],
        replies: [
          new Schema({
            userName: String,
            userId: String,
            userPfp: String,
            text: String,
            images: [String],
            file: {
              type: new Schema({
                base64: String,
                name: String,
                type: String,
                size: String,
              }),
              required: false,
            },
            postedAt: Date,
            likes: [String],
            deleted: { type: Boolean, default: false },
          }),
        ],
      }),
    ],
    default: [],
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
