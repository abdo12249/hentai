// ------------------ Firebase Config ------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCNr3gwtfmqmObVHmTS6K9jvAlcGLZmWAs",
  authDomain: "invertible-pipe-452821-h7.firebaseapp.com",
  projectId: "invertible-pipe-452821-h7",
  storageBucket: "invertible-pipe-452821-h7.firebasestorage.app",
  messagingSenderId: "638279299611",
  appId: "1:638279299611:web:822fb4f02e5943121f3ebe",
  measurementId: "G-9RNN5BS7DG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// عناصر الواجهة
const loginBtn = document.getElementById("login-btn");
const facebookBtn = document.getElementById("facebook-btn");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");
const userName = document.getElementById("user-name");
const userPic = document.getElementById("user-pic");

// تسجيل الدخول بجوجل
loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      console.log("تم تسجيل الدخول بجوجل:", result.user);
    })
    .catch((error) => {
      console.error("خطأ:", error);
    });
});

// تسجيل الدخول بفيسبوك
facebookBtn.addEventListener("click", () => {
  signInWithPopup(auth, facebookProvider)
    .then((result) => {
      console.log("تم تسجيل الدخول بفيسبوك:", result.user);
    })
    .catch((error) => {
      console.error("خطأ:", error);
    });
});

// تسجيل الخروج
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    console.log("تم تسجيل الخروج");
  });
});

// متابعة حالة المستخدم
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = "none";
    facebookBtn.style.display = "none";
    userInfo.style.display = "block";
    userName.textContent = user.displayName;
    userPic.src = user.photoURL;
  } else {
    loginBtn.style.display = "block";
    facebookBtn.style.display = "block";
    userInfo.style.display = "none";
  }
});
