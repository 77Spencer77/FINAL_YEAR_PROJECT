import "./App.css";
import "./components/Login.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import Chat from "./Chat";
import { useAuth0 } from "@auth0/auth0-react";
const socket = io.connect("https://final-year-project-6.onrender.com/");
// const socket = io.connect("http://localhost:3001/");

function App() {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const _mail = user.name;
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div>
      <div className="App">
        {!showChat ? (
          <div className="joinChatContainer">
            <div class="nine">
              <h1>
                Secure Chat Application<span>ENCRYPTED</span>
              </h1>
            </div>
            <div className="user-name">Hi! {_mail}</div>

            <input
              type="text"
              placeholder="ENTER USERNAME"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="ENTER CHAT ID"
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
            <button onClick={joinRoom}>Join A Chat</button>
          </div>
        ) : (
          <Chat socket={socket} username={username} room={room} />
        )}
        <div className="user_profile">
          <button onClick={(e) => logout()}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default App;
