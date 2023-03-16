import "./chat.scss";
import { useEffect, useState, useRef} from "react";
import io from "socket.io-client";
import commandRun from "./commands";
import React from "react";

//const socket = io(`${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/`)

const Chat = () => {
  const [auth, setAuth] = useState("")
  const [connected, setConnected] = useState(false);
  const [usrCount, setUCount] = useState(0)
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const connectSocket = useRef()
  const socket = connectSocket.current;

  const search = window.location.search;
  const params = new URLSearchParams(search);

  useEffect(() => {
    console.log("Connected");
    connectSocket.current = io(`${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/`)
  },[])
  
  useEffect(() => {
    //console.log(process.env.REACT_APP_IP);
    if (connected) {
      socket.on("connected", (res) => {
        const chat = document.getElementById("chat");
        chat.innerHTML += `<p class="system-msg">
        <abbr title="Whisper..."><strong>${res.name}</strong></abbr> has joined the chat!</p>`;
        chat.scrollBy(0,100);

        setUCount(res.usrCount);
        socket.emit("auth", {
          type: "connect"
        })
        const senders = document.getElementsByTagName("strong");
        const count = senders.length;
        for (let i = 0; i < count; i++) {
          const sender = senders[i];
          sender.addEventListener("click", function(e) {
            console.log(e.target.innerHTML);
            setMessage(`/w -${e.target.innerHTML} -`)
            document.getElementById("msg").focus()
          })
        }
      });

      socket.on("disconnected", (res) => {
        const chat = document.getElementById("chat");
        chat.innerHTML += `<p class="system-msg">
        <abbr title="Whisper..."><strong>${res.name}</strong></abbr> has left the chat.</p>`
        chat.scrollBy(0,100);
        setUCount(res.usrCount);
        const senders = document.getElementsByTagName("strong");
        const count = senders.length;
        socket.emit("auth", {
          type: "disconnect"
        })
        for (let i = 0; i < count; i++) {
          const sender = senders[i];
          sender.addEventListener("click", function(e) {
            console.log(e.target.innerHTML);
            setMessage(`/w -${e.target.innerHTML} -`)
            document.getElementById("msg").focus()
          })
        }
      })

      socket.on("chat", (res) => {
        console.log("Geldi");
        const chat = document.getElementById("chat");
        chat.innerHTML += `<p><abbr title="Whisper..."><strong>${res.name}</strong></abbr>: ${res.message}</p>`;
        chat.scrollBy(0,100);

        const senders = document.getElementsByTagName("strong");
        const count = senders.length;
        for (let i = 0; i < count; i++) {
          const sender = senders[i];
          sender.addEventListener("click", function(e) {
            console.log(e.target.innerHTML);
            setMessage(`/w -${e.target.innerHTML} -`)
            document.getElementById("msg").focus()
          })
        }
      });

      socket.on(`whisper-${name}`, (res) => {
        console.log("Whisper geldi");
        console.log(res);
        const chat = document.getElementById("chat");
        chat.innerHTML += `<p class="whisper">
        <abbr title="Whisper..."><strong class="whisper-sender">${res.name}</strong></abbr>: ${res.message}</p>`;
        chat.scrollBy(0,100);

        const senders = document.getElementsByTagName("strong");
        const count = senders.length;
        for (let i = 0; i < count; i++) {
          const sender = senders[i];
          sender.addEventListener("click", function(e) {
            console.log(e.target.innerHTML);
            setMessage(`/w -${e.target.innerHTML} -`)
            document.getElementById("msg").focus()
          })
        }
      })
      socket.on(`kick-${name}`, () => {
        console.log("Kendimi kicklemeliyim");
        //const navigate = useNavigate()
        // window.open("about:blank", "_self");
        // window.close();
        console.log(window.location);
        window.location.search = ""
        window.location.pathname = "/kicked"
      })
      socket.on("auth", (res) => {
        console.log("AUTH");
        setAuth(res.auth)
      }) 
    }
  }, [connected, name, socket]);


  return (
    <div>
      <div className="chat-container">
        <h1>{params.get("id") ? `${name} - Room: ${params.get("id")}` : "Please join any room!"}</h1>
        {connected ? 
        <div>
          <h1>{usrCount ? `Connected: ${usrCount} - Auth: ${auth.charAt(0).toUpperCase() + auth.substring(1)}` : "Loading..."}</h1>
          <div className="chat-content" id="chat"></div>
        </div>
         : null}
        {connected ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              socket.emit("chat", {
                room: params.get("id"),
                name: name,
                message: message,
              });
              setMessage("")
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
                    const chat = document.getElementById("chat");
                    if (message.charAt(0) === "/") {
                      commandRun(message, name, chat, socket);
                    } else {
                      socket.emit("chat", {
                        room: params.get("id"),
                        name: name,
                        message: message
                    })
                    }
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
        <h2>By MertJS</h2>
      </div>
    </div>
  );
};

export default React.memo(Chat);
