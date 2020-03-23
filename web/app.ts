import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";

/**
 * This is the public web API key (you can see this)
 * This is NOT the Firebase admin API key
 */
const WEB_API_KEY = "AIzaSyCSo4PAiC-cr1euluE4XybGZntQve3rc78";

firebase.initializeApp({
  apiKey: WEB_API_KEY,
  authDomain: "frankenstein-ce9dd.firebaseapp.com",
  databaseURL: "https://frankenstein-ce9dd.firebaseio.com",
  projectId: "frankenstein-ce9dd",
  storageBucket: "frankenstein-ce9dd.appspot.com",
  messagingSenderId: "168976872219",
  appId: "1:168976872219:web:bd6ef874bb4a27feb419be"
});

// const store = storage();
const db = firebase.database();

const slug = window.location.pathname;

db.ref(slug).on("value", snapshot => {
  const value = snapshot.val();
  const loader = new Image();
  loader.src = value.url;
  loader.addEventListener("load", () => {
    const img = document.querySelector<HTMLDivElement>(".image");
    if (img) img.style.backgroundImage = `url(${value.url})`;
  });
});
