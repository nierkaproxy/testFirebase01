import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

import { firebaseConfig } from "./firebase.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

console.log(app);

const user = auth.currentUser;

const form = document.querySelector("form");

onAuthStateChanged(auth, (user) => {
  if (user) {
    form.innerHTML = '';
    form.innerHTML = `<input type="submit" id="logout" value="logout">`;
    document.getElementById("logout").addEventListener("click", (e) => {
      e.preventDefault();
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          console.log("Signed out");
        })
        .catch((error) => {
          // An error happened.
          const errorMessage = error.message;
          console.log(errorMessage);
        });
    });
    const uid = user.uid;
    console.log(uid);
    console.log("user logged in");
  } else {
    form.innerHTML = `
    <input type="text" id="user">
    <input type="password" id="pass">
    <input type="submit" id="submit" value="register">
    <input type="submit" id="login" value="login">
    `;
    document.querySelector("#submit").addEventListener("click", (e) => {
      e.preventDefault();
      const user_email = document.getElementById("user").value;
      const user_pass = document.getElementById("pass").value;
      createUserWithEmailAndPassword(auth, user_email, user_pass)
        .then((userCredential) => {
          const user = userCredential.user;
          const loginTime = new Date();
          set(ref(database, "users/" + user.uid), {
            email: user_email,
            role: "simple_user",
            timestamp: `${loginTime}`,
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    });
    document.querySelector("#login").addEventListener("click", (e) => {
      e.preventDefault();
      const user_email = document.getElementById("user").value;
      const user_pass = document.getElementById("pass").value;
      signInWithEmailAndPassword(auth, user_email, user_pass)
        .then((userCredential) => {
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ...
        });
    });
  }
});