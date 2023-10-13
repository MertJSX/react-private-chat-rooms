export default function commandRun(value, name, chat, socket) {
  if (value.charAt(1) === "w") {
    console.log("This is a Whisper");
    const split = value.split(" ");
    const usr = split[1]; //.slice(0,-1)
    //const msg = split[2]
    let msg = "";
    for (let i = 2; i < split.length; i++) {
      msg += `${split[i]} `;
    }
    //console.log(usr+": "+msg);
    socket.emit("whisper", {
      user: usr,
      sender: name,
      msg: msg,
    });
  } else if (value.substr(0, 5) === "/kick") {
    //console.log("You are kicked :d");
    const split = value.split(" ");
    console.log(split[1]);

    socket.emit("kick", {
      name: split[1],
    });
  } else {
    switch (value) {
      case "/cls":
        chat.innerHTML = "";
        chat.innerHTML += `<p class="system-msg">Chat cleared!</p>`;
        chat.scrollBy(0, 100);
        break;
      case "/help":
        chat.innerHTML += `<p class="system-msg">
            <br>
            <- Help Menu -> <br>
            <span class="cmd">/help</span> - Help <br>
            <span class="cmd">/cls</span> - Clear chat <br>
            <span class="cmd">/w %name% %message%</span> - Whisper to user <br>
            <span class="cmd">/kick %name%</span> - Kick User (You must be Admin)<br>
            <br>
            </p>`;
        chat.scrollBy(0, 1000);
        break;
      default:
        chat.innerHTML += `<p class="system-msg">Unknown command <span class="cmd">${value}</span><br>
            Please try <span class="cmd">/help</span></p>`;
        chat.scrollBy(0, 100);
        break;
    }
  }
}
