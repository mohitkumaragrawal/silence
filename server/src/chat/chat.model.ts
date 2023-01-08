import { Schema, model } from "mongoose";

const ChatSchema = new Schema({
  person1: String,
  person2: String,
  owner: String,
  type: String,
  data: String,
  createdAt: Date,
});

const Chat = model("chat", ChatSchema);
export default Chat;
