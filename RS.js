// ---------------- Firebase Config ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getFirestore, doc, getDoc, setDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCNr3gwtfmqmObVHmTS6K9jvAlcGLZmWAs",
  authDomain: "invertible-pipe-452821-h7.firebaseapp.com",
  projectId: "invertible-pipe-452821-h7",
  storageBucket: "invertible-pipe-452821-h7.firebasestorage.app",
  messagingSenderId: "638279299611",
  appId: "1:638279299611:web:822fb4f02e5943121f3ebe",
  measurementId: "G-9RNN5BS7DG"
};

// ---------------- تهيئة ----------------
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------------- سجل المشاهدة ----------------
let history = [];
let userId = null;

// ✅ تحميل السجل من Firebase
async function loadHistoryFromFirebase() {
  if (!userId) return;

  try {
    const docRef = doc(db, "histories", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      history = docSnap.data().history || [];
    } else {
      history = [];
    }

    // ✅ حفظ نسخة محلية احتياطية
    localStorage.setItem("watchHistoryBackup", JSON.stringify(history));

  } catch (err) {
    console.warn("⚠️ فشل تحميل السجل من Firebase:", err);
    const backup = localStorage.getItem("watchHistoryBackup");
    if (backup) history = JSON.parse(backup);
  }

  displayHistory();
}

// ✅ حفظ السجل في Firebase (مع دمج وليس استبدال)
// ✅ حفظ السجل في Firebase (دمج ذكي لا يمسح القديم)
async function saveHistoryToFirebase() {
  if (!userId) return;

  try {
    const docRef = doc(db, "histories", userId);
    const docSnap = await getDoc(docRef);

    let existingHistory = [];
    if (docSnap.exists()) {
      existingHistory = docSnap.data().history || [];
    }

    // 🔁 دمج الجديد مع القديم بدون تكرار
    const merged = [...history, ...existingHistory].reduce((acc, cur) => {
      if (!acc.find(item => item.url === cur.url)) acc.push(cur);
      return acc;
    }, []);

    await setDoc(docRef, { history: merged }, { merge: true });
    localStorage.setItem("watchHistoryBackup", JSON.stringify(merged));
  } catch (err) {
    console.error("⚠️ فشل حفظ السجل في Firebase:", err);
  }
}


// ✅ إضافة صفحة إلى السجل
function addToHistory(pageName, pageURL = window.location.href) {
  if (
    pageName.includes("سجل المشاهدة") ||
    pageURL.includes("watch-history") ||
    pageURL.includes("سجل")
  ) return;

  // منع التكرار
  const exists = history.some(item => item.url === pageURL);
  if (exists) return;

  // إضافة جديدة في الأعلى
  history.unshift({ name: pageName, url: pageURL });

  // حفظ وتحديث العرض
  saveHistoryToFirebase();
  displayHistory();
}

// ✅ عرض السجل في الصفحة
function displayHistory() {
  const historyList = document.getElementById("history-list");
  if (!historyList) return;

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<li>لا يوجد سجل حتى الآن</li>";
  } else {
    history.forEach((entry) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = entry.url;
      link.textContent = entry.name;
      link.style.textDecoration = "none";
      link.style.color = "#007bff";
      listItem.appendChild(link);
      historyList.appendChild(listItem);
    });
  }
}

// ✅ مسح السجل
function clearHistory() {
  history = [];
  saveHistoryToFirebase();
  displayHistory();
}

// ✅ عكس ترتيب السجل
function reverseHistory() {
  history.reverse();
  saveHistoryToFirebase();
  displayHistory();
}

// ---------------- تسجيل الدخول ----------------
const provider = new GoogleAuthProvider();

async function signIn() {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Login Error:", err);
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
    await loadHistoryFromFirebase();
  } else {
    userId = null;
    history = [];
    displayHistory();
  }
});

// ---------------- ربط الأزرار ----------------
const clearHistoryButton = document.getElementById("clear-history");
if (clearHistoryButton) clearHistoryButton.addEventListener("click", clearHistory);

const reverseHistoryButton = document.getElementById("reverse-history");
if (reverseHistoryButton) reverseHistoryButton.addEventListener("click", reverseHistory);

// ✅ جعل الدوال متاحة عالمياً
window.addToHistory = addToHistory;
window.clearHistory = clearHistory;
window.reverseHistory = reverseHistory;
window.signIn = signIn;




