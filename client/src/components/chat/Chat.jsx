import "./chat.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");
const Chat = () => {
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const search = window.location.search;
  const params = new URLSearchParams(search);

  useEffect(() => {
    socket.on("connected", (res) => {
      const chat = document.getElementById("chat");
      chat.innerHTML += `<p><strong>${res.name}</strong> was joined the chat!</p>`;
    });
    socket.on("disconnected", (res) => {
      const chat = document.getElementById("chat");
      chat.innerHTML += `<p><strong>${res.name}</strong> was left the chat.</p>`
    })
    socket.on("chat", (res) => {
      console.log("Geldi");
      const chat = document.getElementById("chat");
      chat.innerHTML += `<p><strong>${res.name}</strong>: ${res.message}</p>`;
    });
    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
      socket.emit("sex", {
        name: "Sex"
      })        
      }

    })
  }, []);

  return (
    <div>
      <div className="chat-container">
        <h1>{params.get("id") ? name+" - Room: " + params.get("id") : "Chat"}</h1>
        {connected ? <div className="chat-content" id="chat"></div> : null}
        {connected ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              socket.emit("chat", {
                room: params.get("id"),
                name: name,
                message: message,
              });
            }}
          >
            <input
              type="text"
              placeholder="Message"
              id="msg"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
               onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (message !== "") {
                    socket.emit("chat", {
                      room: params.get("id"),
                      name: name,
                      message: message
                  })
                  setMessage("");
                  }
              }
               }}
            />
            <br />
            <button type="submit">SUBMIT</button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              socket.emit("join", {
                name: name,
                room: params.get("id"),
              });
              setConnected(true);
            }}
          >
            <input
              type="text"
              className="usrname"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <br />
            <button type="submit">CONNECT</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
