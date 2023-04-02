import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  users: {
    type: [{ _id: String, firstName: String, lastName: String, pfp: String }],
    required: true,
  },
});

const Group = mongoose.model("Group", groupSchema);

export default Group;
