// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const userId = localStorage.getItem("waamir_user_id") || generateRandomId();
localStorage.setItem("waamir_user_id", userId);

function generateRandomId() {
  return 'user_' + Math.floor(Math.random() * 1000000);
}

function addFriend() {
  const friendId = document.getElementById("friendIdInput").value;
  if (!friendId) return alert("Enter Friend ID");

  db.ref(`users/${userId}/friends/${friendId}`).set(true);
  document.getElementById("friendIdInput").value = "";
}

function focusInput() {
  document.getElementById("friendIdInput").focus();
}

function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(btn => btn.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  event.target.classList.add("active");
}

// Realtime listener
db.ref(`users/${userId}/friends`).on("value", snapshot => {
  const friendsList = document.getElementById("friendsList");
  friendsList.innerHTML = "";

  snapshot.forEach(child => {
    const li = document.createElement("li");
    li.textContent = child.key;
    friendsList.appendChild(li);
  });
});
