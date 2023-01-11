import dotenv from "dotenv";
import http from "http";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import AuthRouter from "./auth/auth.router";
import ChatRouter from "./chat/chat.router";

import chatio from "./chat";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.status(200).end("working!");
});

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", AuthRouter);
app.use("/chat", ChatRouter);

mongoose
  .connect(
    process.env.MONGO_CONNECTION_STRING || "mongodb://localhost:27017/silence"
  )
  .then(
    (success) => {
      console.log("successfully connected to the dB");

      const PORT = process.env.PORT || "3000";
      console.log(`started listening at port ${PORT}`);
      chatio.listen(server);
      server.listen(PORT);
    },
    (nah) => {
      console.error("couldn't connect to db", nah);
    }
  );
