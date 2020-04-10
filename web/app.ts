import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";

const track = (data: any) => {
  try {
    (window as any).gtag(data.action, data.event);
  } catch (error) {}
};

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
const storage = firebase.storage();

const slug = window.location.pathname;
const loader = new Image();

db.ref(slug).on("value", snapshot => {
  const value = snapshot.val();
  if (!value) return;
  loader.src = value.url;
  loader.addEventListener("load", () => {
    const img = document.querySelector<HTMLImageElement>(".image img");
    if (img) img.setAttribute("src", value.url);
    track({
      action: "update-image",
      event: value.url
    });
  });
});

const save = document.querySelector(".save");
save.addEventListener("click", () => {
  track({ action: "save" });
  fetch(`https://cors-anywhere.herokuapp.com/${loader.src}`, {
    headers: {
      "X-Requested-With": "mockingbird.netlify.com"
    }
  })
    .then(image => image.blob())
    .then(blob => {
      const name = `${new Date().getTime()}-upload.jpg`;
      storage
        .ref(`users/${slug}/${name}`)
        .put(blob, { contentType: "image/jpeg" })
        .then(() => {
          if (history) history.classList.add("visible");
          updateHistory();
        })
        .catch(() => {});
    })
    .catch(() => {});
});

const historyButton = document.querySelector(".history");
const history = document.querySelector(".history-view");

historyButton.addEventListener("click", () => {
  track({ action: "history" });
  if (history) history.classList.toggle("visible");
  updateHistory();
});

const updateHistory = () => {
  storage
    .ref()
    .child(`users/${slug}`)
    .listAll()
    .then(files => {
      let html = "<h1>Files</h1><ul>";
      files.items.forEach(file => {
        requestAnimationFrame(() => {
          file
            .getDownloadURL()
            .then(url => {
              const item = document.querySelector(
                `[data-image="${file.name}"]`
              );
              if (item) {
                item.querySelector("img").setAttribute("src", url);
                item.querySelector("a").setAttribute("href", url);
              }
            })
            .catch(() => {});
        });
        html += `<li data-image="${file.name}"><a href="#" target="_blank">
          <img alt="">
          <div>
            <div class="date">${new Date(
              parseInt(file.name.split("-")[0])
            ).toLocaleString()}</div>
          </div>
        </a></li>`;
      });
      html += "</ul>";
      if (history) history.innerHTML = html;
    })
    .catch(() => {});
};
