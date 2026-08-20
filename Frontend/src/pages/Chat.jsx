import { useEffect, useState, useRef } from "react";
import "./Chat.css";
import socket from "../socket";
import Sidebar from "../components/Sidebar";
import EmojiPicker from "emoji-picker-react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [enterToSend, setEnterToSend] = useState(
    localStorage.getItem("enterToSend") !== "false"
  );
  const [typingUser, setTypingUser] = useState("");
  const typingTimer = useRef(null);
  const [image, setImage] = useState(null);
  const [chatWallpaper, setChatWallpaper] = useState(
    localStorage.getItem("chatWallpaper") || "#efeae2"
  );
  const [chatFontSize, setChatFontSize] = useState(
    localStorage.getItem("chatFontSize") || "medium"
  );
  const fileInputRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [menuMessage, setMenuMessage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem(
        "selectedChatUser",
        JSON.stringify(selectedUser)
      );
    }
  }, [selectedUser]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [lastMessageTimes, setLastMessageTimes] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "/";
    return null;
  }

  const sender = user.name;
  const typingIndicatorEnabled =
    localStorage.getItem("typingIndicator") !== "false";

  console.log("My Name:", sender);

  useEffect(() => {

    socket.emit("userOnline", sender);

    console.log("Sent Online:", sender);

    socket.on("onlineUsers", (users) => {
      console.log("Online Users:", users);
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsers");
    };

  }, [sender]);

  const receiver = selectedUser?.name || "";
  // =======================
  // Get Messages
  // =======================

  const getMessages = async () => {
    try {
      const url = selectedUser
        ? `http://localhost:5000/api/messages?sender=${sender}&receiver=${selectedUser.name}`
        : "http://localhost:5000/api/messages";

      const res = await fetch(url);
      const data = await res.json();

      setMessages(data);
    } catch (err) {
      console.log(err);
    }
  };
  const markMessagesAsRead = async () => {
    if (!selectedUser) return;

    try {
      await fetch("http://localhost:5000/api/messages/read", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: selectedUser.name,
          receiver: sender,
        }),
      });

      setTimeout(() => {
        getMessages();
      }, 200);

    } catch (err) {
      console.log(err);
    }
  };

  // =======================
  // Get Users
  // =======================

  const getUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();

      const otherUsers = data.filter((u) => u.name !== sender);

      setUsers(otherUsers);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users]);

  useEffect(() => {

    setTypingUser("");
    clearTimeout(typingTimer.current);
    getUsers();
    getMessages();
    if (selectedUser) {
      markMessagesAsRead();

      setUnreadCounts((prev) => ({
        ...prev,
        [selectedUser.name]: 0,
      }));
    }
    socket.on("receiveMessage", (newMessage) => {
      getMessages();

      setLastMessages((prev) => ({
        ...prev,
        [newMessage.sender]: newMessage.message || "📷 Image",
      }));
      setLastMessageTimes((prev) => ({
        ...prev,
        [newMessage.sender]: newMessage.time,
      }));

      if (
        newMessage.receiver === sender &&
        (!selectedUser || newMessage.sender !== selectedUser.name)
      ) {
        setUnreadCounts((prev) => ({
          ...prev,
          [newMessage.sender]: (prev[newMessage.sender] || 0) + 1,
        }));
      }
    });
    socket.on("messageDeleted", getMessages);

    socket.on("chatCleared", ({ sender: clearedSender, receiver: clearedReceiver }) => {
      if (
        (clearedSender === sender && clearedReceiver === selectedUser?.name) ||
        (clearedSender === selectedUser?.name && clearedReceiver === sender)
      ) {
        setMessages([]);
      }
    });
    socket.on("messageRead", (data) => {
      console.log("READ EVENT RECEIVED:", data);

      if (
        data.receiver === sender &&
        selectedUser &&
        data.sender === selectedUser.name
      ) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (
              msg.sender === sender &&
              msg.receiver === data.sender
            ) {
              return {
                ...msg,
                status: "read",
              };
            }

            return msg;
          })
        );
      }
    });


    socket.on("userTyping", (data) => {
      console.log("Typing received:", data);

      if (
        data.sender !== sender &&
        selectedUser &&
        selectedUser.name === data.sender &&
        data.receiver === sender
      ) {
        setTypingUser(data.sender);
      }
    });
    socket.on("userStoppedTyping", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageDeleted");
      socket.off("messageRead");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };

  }, [selectedUser]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =======================
  // Send Message
  // =======================

  const sendMessage = async () => {
    console.log("Send button clicked");
    if (!text.trim() && !image) return;

    if (!selectedUser) {
      alert("Please select a user first");
      return;
    }

    const formData = new FormData();

    formData.append("sender", sender);
    formData.append("receiver", receiver);
    formData.append("message", text);

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/messages/send",
        {
          method: "POST",
          body: formData,
        }
      );
      console.log("Status:", res.status);

      const data = await res.text();
      console.log("Response:", data);

      if (res.ok) {
        setLastMessages((prev) => ({
          ...prev,
          [selectedUser.name]: text || "📷 Image",
        }));
        setText("");
        setImage(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        getMessages();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =======================
  // Delete Message
  // =======================

  const deleteMessage = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/messages/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        getMessages();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =======================
  // Logout
  // =======================

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };
  return (
    <div className="chat-container">

      <div className={`chat-box ${darkMode ? "dark-mode" : ""}`}>

        <div className="chat-header">

          <div>
            <h1>Online Chat</h1>
            <p>Welcome, {sender} 👋</p>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

        <div className="chat-body">

          <Sidebar
            sender={sender}
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            onlineUsers={onlineUsers}
            unreadCounts={unreadCounts}
            lastMessages={lastMessages}
            lastMessageTimes={lastMessageTimes}
          />

          <div className="chat-right">
            <div className="chat-top">

              <div className="chat-user">

                <div className="avatar">
                  {selectedUser?.profileImage ? (
                    <img
                      src={`http://localhost:5000${selectedUser.profileImage}`}
                      alt={selectedUser.name}
                      className="user-profile-image"
                    />
                  ) : (
                    selectedUser?.name?.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <h3>{selectedUser?.name}</h3>

                  <span
                    className={
                      onlineUsers.some(
                        (name) => name.toLowerCase() === selectedUser?.name?.toLowerCase()
                      )
                        ? "online-status"
                        : "offline-status"
                    }
                  >
                    {onlineUsers.some(
                      (name) => name.toLowerCase() === selectedUser?.name?.toLowerCase()
                    )
                      ? "Online"
                      : "Offline"}
                  </span>
                </div>
              </div>

            </div>

            <div
              className="messages"
              style={{
                backgroundColor: chatWallpaper,
                fontSize:
                  chatFontSize === "small"
                    ? "13px"
                    : chatFontSize === "large"
                      ? "18px"
                      : "15px",
              }}
            >


              {
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`message ${msg.sender === sender
                      ? "my-message"
                      : "other-message"
                      }`}
                  >

                    {msg.sender !== sender && <b>{msg.sender}</b>}
                    {msg.image && (
                      <img
                        src={`http://localhost:5000${msg.image}`}
                        alt="Chat"
                        className="chat-image"
                      />
                    )}

                    <span>{msg.message}</span>

                    <small>
                      {new Date(msg.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}

                      {msg.sender === sender && (
                        <span
                          className={`message-status ${msg.status === "read" ? "read-status" : ""
                            }`}
                        >
                          {msg.status === "read" ? "✓✓" : "✓"}
                        </span>
                      )}
                    </small>


                    <div className="message-menu">

                      <button
                        className="menu-dots"
                        onClick={() =>
                          setMenuMessage(
                            menuMessage === msg._id ? null : msg._id
                          )
                        }
                      >
                        ⋮
                      </button>

                      {menuMessage === msg._id && (
                        <div className="delete-menu">
                          <button
                            onClick={() => {
                              deleteMessage(msg._id);
                              setMenuMessage(null);
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}

                    </div>




                  </div>

                ))
              }

              {typingUser && (
                <div className="typing-indicator">
                  {typingUser} is typing...
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>
            {image && (
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                />

                <button
                  onClick={() => {
                    setImage(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  ✖
                </button>
              </div>
            )}
            {showEmoji && (
              <div className="emoji-picker">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setText((prev) => prev + emojiData.emoji);
                    setShowEmoji(false);
                  }}
                />
              </div>
            )}
            <div className="input-box">
              <label className="attach-btn">
                📎
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
              <button
                type="button"
                className="emoji-btn"
                onClick={() => setShowEmoji(!showEmoji)}
              >
                😊
              </button>

              <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => {
                  const value = e.target.value;
                  setText(value);

                  if (selectedUser && value.trim() && typingIndicatorEnabled) {
                    console.log("Typing:", sender, "→", selectedUser.name);

                    socket.emit("userTyping", {
                      sender: sender,
                      receiver: selectedUser.name,
                    });

                    clearTimeout(typingTimer.current);

                    typingTimer.current = setTimeout(() => {
                      socket.emit("userStoppedTyping", {
                        receiver: selectedUser.name,
                      });
                    }, 1500);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && enterToSend) {
                    e.preventDefault();

                    sendMessage();

                    if (selectedUser) {
                      socket.emit("userStoppedTyping", {
                        receiver: selectedUser.name,
                      });
                    }
                  }
                }}
              />

              <button
                type="button"
                className="send-btn"
                onClick={sendMessage}
              >
                Send
              </button>

            </div>

          </div>

        </div>

      </div>

    </div >
  );
}

export default Chat;