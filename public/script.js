const socket = io();
const username = localStorage.getItem("username");
document.getElementById("user-name").textContent = username;

const form = document.getElementById("chatForm");
const input = document.getElementById("message");
const messagesDiv = document.getElementById("messages");

form.onsubmit = function (e) {
  e.preventDefault();
  const msg = input.value.trim();
  if (msg) {
    socket.emit("chat message", { name: username, text: msg });
    input.value = "";
  }
};

socket.on("chat message", (msg) => {
  const div = document.createElement("div");
  div.textContent = `${msg.name}: ${msg.text}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
