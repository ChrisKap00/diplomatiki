import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  pfp: { type: String, required: false },
  verified: { type: Boolean, default: false },
  groups: { type: [String], default: [] },
  posts: { type: [{ _id: String, groupId: String }], default: [] },
});

const User = mongoose.model("User", userSchema);

export default User;
