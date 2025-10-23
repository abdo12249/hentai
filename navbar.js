// وظيفة للتحقق من وجود العناصر وإعادة المحاولة إذا لزم الأمر
function initializeElements() {
// عنصر تبديل الثيم
const themeToggle = document.getElementById('themeToggle');

// دالة لتطبيق الثيم بناءً على التخزين المحلي
function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    } else {
        // إذا لم يكن هناك ثيم محفوظ، يمكن تعيين الثيم الافتراضي
        document.body.classList.add('dark-mode'); // أو 'dark-mode' حسب الرغبة
    }
}

// تطبيق الثيم عند تحميل الصفحة
applyTheme();

if (themeToggle) {
    themeToggle.addEventListener('click', function () {
        // التبديل بين الثيمات
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            // حفظ الثيم في localStorage
            localStorage.setItem('theme', 'light-mode');
        } else {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            // حفظ الثيم في localStorage
            localStorage.setItem('theme', 'dark-mode');
        }
    });
} else {
    console.log("لم يتم العثور على themeToggle. سيتم المحاولة مرة أخرى بعد 5 ثوانٍ...");
    setTimeout(initializeElements, 1000); // إعادة المحاولة بعد 5 ثوانٍ
    return;
}


    // عنصر القائمة الجانبية الموبيل
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active'); // فتح أو غلق القائمة
        });
    } else {
        console.log("لم يتم العثور على menu-btn أو sidebar. سيتم المحاولة مرة أخرى بعد 5 ثوانٍ...");
        setTimeout(initializeElements, 1000); // إعادة المحاولة بعد 5 ثوانٍ
        return;
    }

    console.log("تم العثور على جميع العناصر المطلوبة وتفعيل الأحداث.");
}

// استدعاء الوظيفة لأول مرة
initializeElements();


// تفضيلت 

document.addEventListener("DOMContentLoaded", function () {
    let currentPage = {
        url: window.location.href,
        title: document.title // اسم الموقع الحالي
    };

    let savedSites = localStorage.getItem("savedSites") ? JSON.parse(localStorage.getItem("savedSites")) : [];

    function updateButtonState() {
        let button = document.getElementById("saveButton");
        if (!button) return;

        let isSaved = savedSites.some(site => site.url === currentPage.url);

        if (isSaved) {
            button.textContent = "إزالة من للمفضل";
            button.classList.add("saved");
            button.classList.remove("not-saved");
        } else {
            button.textContent = "اضافة للمفضل ";
            button.classList.add("not-saved");
            button.classList.remove("saved");
        }
    }

    function toggleLink() {
        let index = savedSites.findIndex(site => site.url === currentPage.url);

        if (index === -1) {
            savedSites.push(currentPage); // إضافة الموقع
        } else {
            savedSites.splice(index, 1); // إزالة الموقع
        }

        localStorage.setItem("savedSites", JSON.stringify(savedSites));
        updateButtonState();
    }

    function loadLinks() {
        let list = document.getElementById("linksList");
        if (!list) return;

        let savedSites = localStorage.getItem("savedSites") ? JSON.parse(localStorage.getItem("savedSites")) : [];
        list.innerHTML = "";

        savedSites.forEach(site => {
            let listItem = document.createElement("li");
            let anchor = document.createElement("a");
            anchor.href = site.url;
            anchor.textContent = site.title;
            anchor.target = "_blank"; // فتح الرابط في نافذة جديدة

            listItem.appendChild(anchor);
            list.appendChild(listItem);
        });
    }

    function clearLinks() {
        localStorage.removeItem("savedSites");
        loadLinks();
    }

    // إذا كان الزر موجودًا في الصفحة، قم بتحديث حالته
    if (document.getElementById("saveButton")) {
        updateButtonState();
        document.getElementById("saveButton").addEventListener("click", toggleLink);
    }

    // إذا كان هناك قائمة للروابط المحفوظة، قم بتحميلها
    if (document.getElementById("linksList")) {
        loadLinks();
        let clearButton = document.getElementById("clearButton");
        if (clearButton) clearButton.addEventListener("click", clearLinks);
    }
});

// تحميل gtag.js مرة واحدة فقط
if (!document.querySelector('script[src*="www.googletagmanager.com/gtag/js"]')) {
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-BX7750CBQ5';
    document.head.appendChild(gtagScript);
}

// تعريف dataLayer و gtag مرة واحدة فقط
if (!window.dataLayer) {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag; // حفظها في window للتأكد إنها متاحة
    gtag('js', new Date());
    gtag('config', 'G-BX7750CBQ5');
}



// ---------------- نظام البحث المتصل بملف JSON ----------------
document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar-container");

  const observer = new MutationObserver(() => {
    const searchInput = document.getElementById("searchInput");
    const animeList = document.getElementById("animeList");

    if (searchInput && animeList) {
      observer.disconnect();
      initializeSearchSystem(searchInput, animeList);
    }
  });

  observer.observe(navbarContainer, { childList: true, subtree: true });
});

function initializeSearchSystem(searchInput, animeList) {
  const dataUrl = "https://myanima.ddns.net/test1/animes.json";
  let animeData = {};

  fetch(dataUrl)
    .then(res => res.json())
    .then(data => {
      animeData = data;
      console.log("✅ تم تحميل بيانات الأنميات بنجاح");
    })
    .catch(err => console.error("❌ فشل تحميل بيانات الأنميات:", err));

  Object.assign(animeList.style, {
    position: "absolute",
    background: "var(--search-bg, #222)",
    color: "white",
    width: "100%",
    maxHeight: "250px",
    overflowY: "auto",
    borderRadius: "10px",
    display: "none",
    zIndex: "1000",
    padding: "5px",
    direction: "rtl"
  });

  // عند الكتابة في مربع البحث
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    animeList.innerHTML = "";

    if (query.length === 0) {
      animeList.style.display = "none";
      return;
    }

    const results = Object.entries(animeData).filter(([key, anime]) =>
      anime.title.toLowerCase().includes(query)
    );

    if (results.length === 0) {
      animeList.style.display = "none";
      return;
    }

    results.forEach(([key, anime]) => {
      const item = document.createElement("a");
      const dynamicUrl = `https://myanima.ddns.net/test1/Anime%20Page%20Dynamic.html?id=${encodeURIComponent(key)}`;
      item.href = dynamicUrl;

      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.padding = "8px";
      item.style.gap = "8px";
      item.style.textDecoration = "none";
      item.style.color = "inherit";
      item.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
      item.style.transition = "background 0.2s";

      const img = document.createElement("img");
      img.src = anime.image || "https://myanima.ddns.net/img/no-image.webp";
      img.alt = anime.title;
      img.style.width = "40px";
      img.style.height = "55px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "6px";

      const titleDiv = document.createElement("div");
      titleDiv.textContent = anime.title;
      titleDiv.style.flex = "1";

      item.addEventListener("mouseover", () => (item.style.background = "rgba(255,255,255,0.1)"));
      item.addEventListener("mouseout", () => (item.style.background = "transparent"));

      item.appendChild(img);
      item.appendChild(titleDiv);
      animeList.appendChild(item);
    });

    animeList.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !animeList.contains(e.target)) {
      animeList.style.display = "none";
    }
  });
}

