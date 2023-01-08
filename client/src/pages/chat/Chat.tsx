import { useEffect, useState, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "../../auth/auth.context";

import axios from "../../helpers/axios";

import Button from "../../components/Button";
import useStickers from "../../hooks/useStickers";

interface ChatBubbleProps {
  children: React.ReactNode;
  owner: boolean;
  onwerUsername?: string;
}

interface Contact {
  name: string;
  username: string;
  bio?: string;
}

interface Chat {
  person1: string;
  person2: string;
  type: string;
  owner: string;
  data: string;
  createdAt: Date;
}

function ContactItem(props: {
  username: string;
  active: boolean;
  handleClick: () => void;
}) {
  const { username, active } = props;
  return (
    <div
      className={`p-3 transition-all cursor-pointer rounded hover:bg-slate-800 ${
        active ? "bg-orange-700" : ""
      }`}
      onClick={() => props.handleClick()}
    >
      {username}
    </div>
  );
}

const availableIntents = [
  "welcome",
  "happy",
  "curse",
  "greetings",
  "negative_feedback",
  "positive_feedback",
  "end_of_conversation",
];

function ChatBubble(props: ChatBubbleProps) {
  const { children, owner, onwerUsername } = props;
  return (
    <div className={`flex ${owner ? "flex-row-reverse" : ""}`}>
      <div>
        <p>{owner ? "You" : onwerUsername}</p>
        <div
          className={`px-4 py-2 rounded-lg ${
            owner ? "bg-blue-700" : "bg-slate-700"
          }`}
        >
          {children}
        </div>
      </div>
      <div className="flex-1"></div>
    </div>
  );
}

export default function Chat() {
  const auth = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [mySocket, setMySocket] = useState<Socket<any, any>>(null);

  const [contacts, setContacts] = useState<Array<Contact>>([]);
  const [selectedContact, setSelectedContact] = useState<Contact>(null);
  const [chats, setChats] = useState<Array<Chat>>([]);

  const [notifications, setNotifications] = useState<Array<String>>([]);
  const [stickersVisisble, setStickersVisisble] = useState(false);

  const { intent, setIntent, loading, stickerData } = useStickers();

  const pushNotification = (message: String) => {
    setNotifications((notif) => {
      let newNotif = [...notif];
      newNotif.push(message);

      // Add a setTimeout to remove this message;
      setTimeout(() => {
        setNotifications((notif2) => {
          let newNotif2 = notif2.filter((val) => {
            if (val === message) return false;
            return true;
          });

          return newNotif2;
        });
      }, 2000);

      return newNotif;
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    const socket = io(process.env.REACT_APP_BACKEND, {
      query: { token },
    });
    setMySocket(socket);
  }, []);

  useEffect(() => {
    if (!mySocket) return;

    mySocket.on("server-message", (chat: Chat) => {
      if (
        selectedContact === null ||
        chat.person2 !== selectedContact.username
      ) {
        pushNotification(`${chat.person2}: ${chat.data}`);
        return;
      }

      let newChats = [...chats];
      newChats.push(chat);

      setChats(newChats);
    });
  }, [mySocket, chats]);

  useEffect(() => {
    axios.post("/chat/contacts").then((data) => {
      let myContacts = data.data as Array<Contact>;
      let newMyContacts = myContacts.filter((contact) => {
        if (contact.username === auth.user.username) {
          return false;
        }
        return true;
      });

      setContacts(newMyContacts);
    });
  }, []);

  useEffect(() => {
    if (selectedContact == null) return;

    axios
      .post("/chat/fetch", {
        person2: selectedContact.username,
      })
      .then((data) => {
        let chats = data.data as Array<Chat>;
        setChats(chats);
      });
  }, [selectedContact]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message === "") return;

    const messagePayload: Chat = {
      person1: auth.user.username,
      person2: selectedContact.username,
      owner: auth.user.username,
      type: "text",
      data: message,
      createdAt: new Date(),
    };

    if (mySocket) {
      mySocket.emit("client-message", messagePayload);
    }

    let newChats = [...chats];
    newChats.push(messagePayload);

    setChats(newChats);
    setMessage("");
  };

  const sendSticker = (url: string) => {
    const messagePayload: Chat = {
      person1: auth.user.username,
      person2: selectedContact.username,
      owner: auth.user.username,
      type: "sticker",
      data: url,
      createdAt: new Date(),
    };

    if (mySocket) {
      console.log("emitting message");
      mySocket.emit("client-message", messagePayload);
    }

    let newChats = [...chats];
    newChats.push(messagePayload);

    setChats(newChats);
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  return (
    <div className="flex h-full w-full">
      {notifications.length > 0 ? (
        <div className="fixed bottom-5 right-5 flex gap-2 flex-col">
          {notifications.map((message) => {
            return (
              <p className="bg-slate-800 shadow-md rounded px-3 py-2">
                {message}
              </p>
            );
          })}
        </div>
      ) : null}

      <div className="h-full p-6 border-r-2 border-r-slate-600 min-w-[200px] overflow-y-auto">
        <h3 className="text-center text-sm font-bold text-slate-600 mb-3">
          Contacts
        </h3>

        <div>
          {contacts.map((contact) => {
            return (
              <ContactItem
                key={contact.username}
                username={contact.username}
                active={contact.username === selectedContact?.username}
                handleClick={() => handleContactSelect(contact)}
              />
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedContact === null ? (
          <div className="font-bold text-5xl flex justify-center items-center h-full">
            silence please!
          </div>
        ) : (
          <>
            <div className="p-3 font-bold bg-slate-800">
              {selectedContact.username}
            </div>
            <div className="flex flex-col flex-1 px-6 gap-3 py-5 overflow-y-auto">
              {chats.map((chat, idx) => {
                return (
                  <ChatBubble
                    owner={chat.owner === auth.user.username}
                    onwerUsername={chat.owner}
                    key={idx}
                  >
                    {/* {chat.data} */}
                    {chat.type === "text" ? (
                      chat.data
                    ) : (
                      <img src={chat.data} width={200} height={200} />
                    )}
                  </ChatBubble>
                );
              })}
            </div>
            <form
              className="flex p-3 bg-slate-800 relative"
              onSubmit={handleFormSubmit}
            >
              {stickersVisisble && (
                <div className="absolute top-0 left-0 right-0 -translate-y-full bg-slate-800 h-60 opacity-75 p-3 overflow-auto">
                  <div className="flex gap-2 items-center justify-center flex-wrap">
                    {availableIntents.map((int, idx) => (
                      <Button
                        className="px-2"
                        onClick={(e) => setIntent(int)}
                        type="button"
                        key={idx}
                      >
                        {int}
                      </Button>
                    ))}
                  </div>

                  {loading || stickerData.length === 0 ? (
                    <p className="justify-center flex items-center">Loading</p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {stickerData.map((sticker, idx) => {
                        console.log(sticker);
                        const media = sticker.media.fixedWidthSmall;
                        let url = media.gif?.url;
                        if (!url) {
                          url = media.png?.url;
                        }

                        const { width, height } = media;

                        return (
                          <img
                            className="p-3 cursor-pointer opacity-80 hover:opacity-100"
                            src={url}
                            width={width / 2}
                            height={height / 2}
                            key={sticker.id}
                            onClick={(e) => sendSticker(url)}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <input
                className="bg-transparent text-slate-300 outline-none w-full transition-all p-2"
                placeholder="Enter your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="flex gap-3">
                <Button
                  className="px-3"
                  type="button"
                  onClick={(e) => setStickersVisisble(!stickersVisisble)}
                >
                  Stickers
                </Button>
                <Button className="px-3">Send</Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
