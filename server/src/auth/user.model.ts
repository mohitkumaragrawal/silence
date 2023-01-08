import { model, Schema } from "mongoose";

export const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    reputation: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const User = model("user", UserSchema);
export default User;
