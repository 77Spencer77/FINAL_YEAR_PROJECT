import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import CryptoJS from "crypto-js";

function Chat({ socket, username, room }) {
  // const random = Math.floor(Math.random() * 100) + 50;
  // const private_key_client = random;
  // const public_key_client = random * 9;
  const [currentMessage, setCurrentMessage] = useState("");
  // const [secretKey, setSecretKey] = useState("");
  const [messageList, setMessageList] = useState([]);
  const secretKey = "your-secret-key";
  const encryptMessage = (message) => {
    return CryptoJS.AES.encrypt(message, secretKey).toString();
  };

  const decryptMessage = (encryptedMessage) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };
  // useEffect(() => {
  //   socket.on("users", (public_key_server) => {
  //     console.log(public_key_server);
  //     let s = (public_key_server * private_key_client).toString() + "giki";
  //     setSecretKey(s);
  //     console.log(s);
  //   });
  // }, [currentMessage]);

  const sendMessage = async () => {
    // await socket.emit("key", public_key_client);

    if (currentMessage !== "") {
      const encryptedMessage = encryptMessage(currentMessage);
      const messageData = {
        room: room,
        author: username,
        message: encryptedMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      const newmessageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      setMessageList((list) => [...list, newmessageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      const decryptedMessage = decryptMessage(data.message);
      const decryptedData = { ...data, message: decryptedMessage };
      setMessageList((list) => [...list, decryptedData]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>LIVE CHAT ID : {room}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div
                key={index}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder=""
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
