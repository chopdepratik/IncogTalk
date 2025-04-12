import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import likeIcon from '../assets/images/like.png'
import "../componets/BasicMultiUserChat.css"
import sendIcon from "../assets/images/sendIcon.png"



const socket = io("https://incogtalk.onrender.com");

const BasicMultiUserChat = () => {
  const bottomRef  = useRef(null)
  const replyRef  = useRef({});
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [joined, setJoined] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [userInRoom, setUsersInRoom] = useState([]);
  const [messageMap, setMessageMap] = useState({});
  const [replyToMsgId, setReplyToMsgId] = useState(null);
  const [replyToUsername, setReplyToUsername] = useState("");
  const [menuVisibleForId, setMenuVisibleForId] = useState(null);
  const [likedMessages, setLikedMessages] = useState({});
  const [highlightedId , setHighlightedId] = useState(null)
  const notificationSound = new Audio("/sentSound.mp3");
  const notificationSoundJoin = new Audio("/notify.mp3");

const handleEnableSound = () => {
  notificationSound.play().then(() => {
     console.log("played")
  }).catch((error) => {
    console.error("User gesture required to play audio:", error);
  });
};

const handleNotifySound = () => {
  notificationSoundJoin.play().then(() => {
     console.log("played")
  }).catch((error) => {
    console.error("User gesture required to play audio:", error);
  });
};

   

  const joinRoom = () => {
    if (room && username) {
      socket.emit("join-room", { username, room });
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send-message", {
        room,
        username,
        message,
        replyTo: replyToMsgId || null,
      });
      handleEnableSound()
      setMessage("");
      setReplyToMsgId(null);
      setReplyToUsername("");
      
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth',  block:'end'});
    }
  }, [chatLog]);

  useEffect(() => {
    const handleUserJoined = (msg, users) => {
      setChatLog((prev) => [...prev, { username: "Server", message: msg }]);
      setUsersInRoom(users);
      handleNotifySound()
    };

    const handleReceiveMessage = ({ username, message, replyTo, id }) => {
      setChatLog((prev) => [...prev, { username, message, replyTo, id }]);
      setTypingUser("");
      setMessageMap((prev) => ({
        ...prev,
        [id]: message,
      }));
      handleEnableSound()

      
    };

    const handleUserLeft = (username, users) => {
      setChatLog((prev) => [
        ...prev,
        { username: "Server", message: `${username} left the room` },
      ]);
      setUsersInRoom(users);
    };

    const handleTyping = (username) => {
      setTypingUser(username);
    };

    const handleLikes = ({ msgId, likes }) => {
        console.log("Received like update:", msgId, likes);
        console.log("Type of likes:", typeof likes);
        console.log("Is array:", Array.isArray(likes));
      
        setLikedMessages((prev) => ({
          ...prev,
          [msgId]: likes,
        }));
      };

    socket.on("user-joined", handleUserJoined);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("updated-users", handleUserLeft);
    socket.on("typing-user", handleTyping);
    socket.on("update-likes", handleLikes);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("updated-users", handleUserLeft);
      socket.off("typing-user", handleTyping);
      socket.off("update-likes", handleLikes);
    };
  }, []);

  return (
    <div  className="main-container" >
      {!joined ? (
        <div className="join-container">
        <div className="form-box">
          <h1 className="chat-title">Welcome to IncogTalk</h1>
          <p className="chat-subtitle">Connect anonymously. Speak freely. 🚀</p>
      
          <form onSubmit={joinRoom}>
            <h2>Join Chat Room</h2>
      
            <input
             className="join-input-field"
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
            className="join-input-field"
              type="text"
              placeholder="Enter room name/create room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />
            <button className="join-button" type="submit">Join</button>
          </form>
        </div>
      </div>
      
      ) : (
        <div className="room-container">
           <div className="heading">
           <h2>Room: {room}</h2>
           <h3>Users in room</h3>
           </div>
          <div
           className="user-container"
          >
            {userInRoom.map((user, index) => (
              <p
                key={index}
              
              >
                {user}
              </p>
            ))}
          </div>

          <div 
           className="chat-container"
             
            onClick={() => setMenuVisibleForId(null)}
          >
            {chatLog.map((chat, index) => {
              const isUser = chat.username === username;
              const isServer = chat.username === "Server";
              const replyText = chat.replyTo ? messageMap[chat.replyTo] : null;
              const repliedUser = chatLog.find(
                (msg) => msg.id === chat.replyTo
              )?.username;

              return (
                <div
                className="chat-inner-container"
                  key={index}
                  style={{
                    alignItems: isServer
                      ? "center"
                      : isUser
                      ? "flex-end"
                      : "flex-start",
                  }}
                >
                  <strong style={{ fontSize: "10px", margin: "0" }}>
                    {isUser || isServer ? "" : chat.username}
                  </strong>

                  {replyText && (
                    <div
                    className="chat-reply-container"
                       
                      onClick={()=>{
                        const ref =replyRef.current[chat.replyTo];
                        console.log( ref)
                        if (ref) {
                          ref.scrollIntoView({ behavior: "smooth", block: "center" });
                           setHighlightedId(chat.replyTo)
                           const interval =setTimeout(()=>{
                             setHighlightedId(null)
                            
                           },2000)

                           
                        }
                   }}
                    >
                      <div
                      className="reply-container-user"
                      >
                        <i>{repliedUser || "User"}</i>
                      </div>
                      <div>
                      <i>{replyText.length > 30 ? replyText.slice(0, 30) + "..." : replyText}</i>
                      </div>
                    </div>
                  )}

                  <p
                     
                       className={` chat-bubble chat-message-container ${highlightedId === chat.id ? "highlighted" : ""}`}
                    style={{
                      textAlign: isUser
                        ? "left"
                        : isServer
                        ? "center"
                        : "left",
                      cursor: "pointer",
                      margin: "0px",
                      border: "#25D366 solid 2px",
                      padding: "5px",
                      borderRadius: isUser
                        ? "10px 0px 10px 10px"
                        : isServer
                        ? "10px"
                        : "0px 10px 10px 10px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuVisibleForId(
                        menuVisibleForId === chat.id ? null : chat.id
                      );
                    }
                   }

                   ref={(el) => {
                    if (index === chatLog.length - 1) {
                      bottomRef.current = el; // for scroll-to-bottom
                    }
              
                    // Assign dynamic ref for this chat (use unique ID or index as key)
                    replyRef.current[chat.id] = el;
                  }}
                     
                  >
                    {chat.message}
                  </p>

                  {likedMessages[chat.id]?.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <img src={likeIcon} alt="like" width={20} height={20} />
                      <p style={{ margin: 0 }}>{likedMessages[chat.id].length}</p>
                    </div>
                  )}

                  {menuVisibleForId === chat.id && (
                    <div
                    className="reply-like-menu"
                      
                    >
                      <span
                        style={{ marginRight: "10px", cursor: "pointer" }}
                        onClick={() => {
                          setReplyToMsgId(chat.id);
                          setReplyToUsername(chat.username);
                          setMenuVisibleForId(null);
                        }}
                      >
                        Reply
                      </span>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          socket.emit("like-message", { room, msgId: chat.id, username });
                          setMenuVisibleForId(null);
                        }}
                      >
                         {
                            !likedMessages[chat.id]?.includes(username) ? 'like': 'DisLike'
                         }
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {typingUser && typingUser !== username && (
              <p style={{ fontSize: "12px", color: "gray" }}>
                {typingUser} is typing...
              </p>
            )}
          </div>

          {replyToMsgId && (
            <div
               className="reply-field"
               
            >
              Replying to <b>{replyToUsername}</b>:{" "}
              <i>{messageMap[replyToMsgId].length > 30 ? messageMap[replyToMsgId].slice(0, 30) + "..." : messageMap[replyToMsgId]}</i>
              <button
                onClick={() => {
                  setReplyToMsgId(null);
                  setReplyToUsername("");
                }}
                style={{ marginLeft: "10px", cursor: "pointer" }}
              >
                ❌
              </button>
            </div>
          )}
          <div className="input-container">
          <input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              socket.emit("typing", { room, username });
            }}

            onKeyDown={(e) => {
              console.log("Pressed:", e.key);
              if (e.key === 'Enter') {
                e.preventDefault();
                console.log("Enter pressed. Sending message...");
                sendMessage();
              }
            }}
            
          />
          <button className="send-button"   onClick={
            sendMessage
            }><img src={sendIcon} alt="" /></button>


          </div>
           
           
        </div>
        
      )}
      {
        joined ? 
        <button
        className="leave-button"
           onClick={() => {
             socket.emit("leave-room", { room, username });
             handleNotifySound()
             setJoined(false);
             setUsersInRoom([]);
             setChatLog([]);
             setRoom("");
             setUsername("");
             setReplyToMsgId(null);
             setReplyToUsername("");
           }}
         >
           Leave Room
         </button>
         :''
      }
          
      
    </div>
  );
};

export default BasicMultiUserChat;
