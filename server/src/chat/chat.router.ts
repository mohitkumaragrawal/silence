import { Router } from "express";

import Chat from "./chat.model";
import AuthMiddleware from "../auth/auth.middleware";
import User from "../auth/user.model";

const ChatRouter = Router();

ChatRouter.post("/fetch", AuthMiddleware, (req, res) => {
  if (!req.auth) {
    res.status(400).end();
    return;
  }
  const person1 = req.auth.username;
  const { person2 } = req.body;

  const q = Chat.find({ person1, person2 }).sort({ createdAt: "asc" });

  q.exec((err, result) => {
    if (err) {
      console.log(err);
      res.status(500).end();
      return;
    }

    res.status(200).json(result).end();
  });
});

ChatRouter.post("/contacts", async (req, res) => {
  const users = await User.find({});

  console.log(users);

  const filteredUsers = users.map((val) => {
    return {
      name: val.name,
      username: val.username,
      bio: val.bio,
    };
  });

  res.status(200).json(filteredUsers).end();
});

export default ChatRouter;
