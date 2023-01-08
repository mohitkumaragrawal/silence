import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import Chat from "./chat.model";

interface AuthPayload {
  name: string;
  username: string;
  email: string;
  _id: string;
}

interface ClientMessagePayload {
  person2: string;
  owner: string;
  type: string;
  data: string;
  createdAt: Date;
}

interface SocketData {
  username: string;
}

interface DefaultEventsMap {
  [event: string]: (...args: any[]) => void;
}

const io = new Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const idmap = new Map<String, Socket>();

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    const token = socket.handshake.query.token as string;

    try {
      const decoded = <AuthPayload>(
        jwt.verify(token, process.env.JWT_KEY || "123456")
      );

      idmap.set(decoded.username, socket);
      socket.data.username = decoded.username;

      next();
    } catch (e) {
      next(new Error("Authentication Error"));
    }
  }
}).on("connection", (socket) => {
  console.log("connection request");

  socket.on("client-message", async (arg: ClientMessagePayload) => {
    console.log(arg);

    const person2Socket = idmap.get(arg.person2);
    if (person2Socket) {
      person2Socket.emit("server-message", {
        person1: arg.person2,
        person2: socket.data.username,
        owner: arg.owner,
        type: arg.type,
        data: arg.data,
        createdAt: arg.createdAt,
      });
    }

    // Store to database from both perspective;
    const chat1 = new Chat({
      person1: socket.data.username,
      person2: arg.person2,
      owner: arg.owner,
      type: arg.type,
      data: arg.data,
      createdAt: arg.createdAt,
    });

    const chat2 = new Chat({
      person1: arg.person2,
      person2: socket.data.username,
      owner: arg.owner,
      type: arg.type,
      data: arg.data,
      createdAt: arg.createdAt,
    });

    await chat1.save();
    await chat2.save();
  });
});

export default io;
