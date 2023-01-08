import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "./user.model";
import jwt from "jsonwebtoken";

function emailValidator(email: string): boolean {
  const regex = /^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/;
  return email.match(regex) != null;
}

export const SignupUser = async (req: Request, res: Response) => {
  const { name, username, password, email } = req.body;

  if (!name || !username || !password || !email) {
    res
      .status(400)
      .json({
        message: "Some of the fields are not provided",
      })
      .end();
    return;
  }

  if (!emailValidator(email)) {
    res
      .status(400)
      .json({
        message: "Invalid email provided",
      })
      .end();
    return;
  }

  const passHash = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    username,
    password: passHash,
    email: email,
    reputation: 0,
  });

  try {
    await user.save();
    res
      .status(200)
      .json({
        message: "Successfully signuped the user",
      })
      .end();
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .json({
        message: "Couldn't signup the user",
      })
      .end();
  }
};

export const LoginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res
      .status(400)
      .json({
        message: "username or password is not provided",
      })
      .end();
    return;
  }

  let user;
  if (emailValidator(username)) {
    user = await User.findOne({ email: username });
  } else {
    user = await User.findOne({ username });
  }

  if (!user) {
    res
      .status(400)
      .json({
        message: "Couldn't find the user",
      })
      .end();
    return;
  }

  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    res.status(400).json({ message: "Invalid credentials" }).end();
    return;
  }

  // Generate the jwt token and send it back;
  const token = jwt.sign(
    {
      name: user.name,
      username: user.username,
      email: user.email,
      _id: user._id,
    },
    process.env.JWT_KEY || "12345"
  );

  res
    .status(200)
    .json({
      name: user.name,
      username: user.username,
      token,
      email: user.email,
    })
    .end();
};

export const VerifyToken = (req: Request, res: Response) => {
  if (!req.auth) {
    res.status(400).end();
    return;
  }

  res.status(200).json(req.auth).end();
};
