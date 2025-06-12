// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, onChildAdded, push } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Firebase config dari kamu
const firebaseConfig = {
  apiKey: "AIzaSyB8iT8Ltm1v0LpBM4WFQsu5ymUi1oS0CQY",
  authDomain: "waamir-5eb50.firebaseapp.com",
  projectId: "waamir-5eb50",
  storageBucket: "waamir-5eb50.firebasestorage.app",
  messagingSenderId: "631725165319",
  appId: "1:631725165319:web:909cd0bbf09b44993513a2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let myId = localStorage.getItem("waamir-id");
if (!myId) {
  myId = "WA-" + Math.floor(Math.random() * 100000);
  localStorage.setItem("waamir-id", myId);
}
console.log("Your ID:", myId);

function addFriend() {
  const friendId = document.getElementById("friendIdInput").value;
  if (!friendId) return alert("Masukkan ID kawan");
  localStorage.setItem("friend-id", friendId);
  alert("Kawan ditambah! Sekarang boleh mula chat.");
}

function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value;
  const friendId = localStorage.getItem("friend-id");

  if (!friendId) return alert("Tiada kawan dipilih.");
  if (!message) return;

  const chatPath = `chats/${myId}_${friendId}`;
  const chatRef = ref(db, chatPath);

  const newMessage = {
    sender: myId,
    message: message,
    timestamp: Date.now()
  };

  push(chatRef, newMessage);
  messageInput.value = "";
}

function listenForMessages() {
  const friendId = localStorage.getItem("friend-id");
  const chatPath = `chats/${myId}_${friendId}`;
  const chatRef = ref(db, chatPath);

  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";

  onChildAdded(chatRef, (data) => {
    const msg = data.val();
    const bubble = document.createElement("div");
    bubble.className = msg.sender === myId ? "msg-right" : "msg-left";
    bubble.innerText = msg.message;
    chatBox.appendChild(bubble);
  });
}

window.showTab = function(tab) {
  document.querySelectorAll(".tab-content").forEach(e => e.classList.remove("active"));
  document.getElementById(tab).classList.add("active");

  if (tab === "chats") {
    listenForMessages();
  }
};

window.focusInput = function() {
  document.getElementById("friendIdInput").focus();
};

window.addFriend = addFriend;
window.sendMessage = sendMessage;
