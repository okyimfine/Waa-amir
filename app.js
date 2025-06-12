// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onChildAdded, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Gantikan config ini dengan milik kamu dari Firebase Console
const firebaseConfig = {
  apiKey: "API_KEY_KAMU",
  authDomain: "PROJECT_ID.firebaseapp.com",
  databaseURL: "https://PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Auto generate ID pengguna
let myId = localStorage.getItem("waamir-id");
if (!myId) {
  myId = "WA-" + Math.floor(Math.random() * 100000);
  localStorage.setItem("waamir-id", myId);
}
console.log("Your ID:", myId);

// Tambah kawan
function addFriend() {
  const friendId = document.getElementById("friendIdInput").value;
  if (!friendId) return alert("Masukkan ID kawan");
  localStorage.setItem("friend-id", friendId);
  alert("Kawan ditambah! Sekarang boleh mula chat.");
}

// Hantar mesej
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

// Dengar mesej secara live
function listenForMessages() {
  const friendId = localStorage.getItem("friend-id");
  const chatPath = `chats/${myId}_${friendId}`;
  const chatRef = ref(db, chatPath);

  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = ""; // Kosongkan bila buka

  onChildAdded(chatRef, (data) => {
    const msg = data.val();
    const bubble = document.createElement("div");
    bubble.className = msg.sender === myId ? "msg-right" : "msg-left";
    bubble.innerText = msg.message;
    chatBox.appendChild(bubble);
  });
}

// Fungsi tab
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
