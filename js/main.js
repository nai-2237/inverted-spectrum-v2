
const menuToggle = document.getElementById("menuToggle");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("drawerOverlay");

function closeMenu() {
  drawer.classList.remove("open");
  overlay.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = drawer.classList.toggle("open");
  overlay.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

overlay.addEventListener("click", closeMenu);

drawer.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

// CHARACTER


const characters = [
  {
    name: "艾因",
    english: "AYN",
    link: "./character.html?id=ayn",
    image: "./assets/images/ayn.jpg"
  },
  {
    name: "穆綺",
    english: "MARLOWE",
    link: "./character.html?id=marlowe",
    image: "./assets/images/marlowe.jpg"
  }
];



let characterIndex = 0;


function renderCharacter() {
  const character = characters[characterIndex];

  document.getElementById("characterName").textContent = character.name;
  document.getElementById("characterEnglish").textContent = character.english;
  document.getElementById("profileLink").href = character.link;
  document.getElementById("characterCounter").textContent =
    `0${characterIndex + 1} / 02`;

  const art = document.querySelector(".character-art");
  art.style.backgroundImage = `url("${character.image}")`;

  document.getElementById("characterPlaceholder").style.display = "none";
}


function changeCharacter(step) {
  characterIndex =
    (characterIndex + step + characters.length) % characters.length;
  renderCharacter();
}

document.getElementById("characterPrev")
  .addEventListener("click", () => changeCharacter(-1));

document.getElementById("characterNext")
  .addEventListener("click", () => changeCharacter(1));

const characterStage = document.querySelector(".character-stage");
let startX = 0;

characterStage.addEventListener("touchstart", event => {
  startX = event.changedTouches[0].screenX;
}, { passive: true });

characterStage.addEventListener("touchend", event => {
  const distance = event.changedTouches[0].screenX - startX;
  if (Math.abs(distance) > 45) {
    changeCharacter(distance < 0 ? 1 : -1);
  }
}, { passive: true });

// TIMELINE
const timeline = [
  { title: "相識", text: "開學季/初見/葉塞線/新理事長/熟識/Nekko誕生/加上聯絡方式/穆綺接觸愛樂者社團/公主節" },
  { title: "相知", text: "〈世界可能〉誕生/艾因成為模特/初次兩人一起出門/聆音社事件/開始曖昧期/穆綺生日/艾因生日/樂園線" },
  { title: "暗戀", text: "艾因暗戀不自知主動進攻/艾因初次住穆綺家/艾因寄告白信/艾因邀請穆綺去私人影院/告白＋穆綺坦白旅者身份/0205定情/214情人節" },
  { title: "相戀", text: "熱戀期/穆綺邀請艾因去看VR電影/覺醒之章/520/七夕/暑假/夏日旅行＋初吻/靈界線/開學/穆綺生日/艾因生日/一週年戒指/第一個214/假面舞會" },
  { title: "相伴", text: "穩定戀愛中/神隕/七夕/諸界歸一/穆綺得知了艾因的音樂小帳/霧都線/十日談＋初見牧首/帝國線（部分）/神棄" }
];

const track = document.getElementById("timelineTrack");
const markers = document.getElementById("timelineMarkers");
const timelineProgress = document.getElementById("timelineProgress");
const positions = [20, 110, 200, 290, 380];
let timelineIndex = 0;

function renderTimeline() {
  const current = timeline[timelineIndex];

  document.getElementById("timelineNumber").textContent =
    `CHAPTER 0${timelineIndex + 1}`;

  document.getElementById("timelineTitle").textContent = current.title;
  document.getElementById("timelineDescription").textContent = current.text;

  markers.querySelectorAll("button").forEach((button, index) => {
    button.classList.toggle("active", index === timelineIndex);
    button.setAttribute("aria-pressed", String(index === timelineIndex));
  });

 timelineProgress.style.height =
  `${positions[timelineIndex] / 400 * 100}%`;
}

positions.forEach((position, index) => {
  const button = document.createElement("button");
  button.className = "timeline-marker";
  button.style.top = `${position / 400 * 100}%`;
  button.setAttribute("aria-label", timeline[index].title);
  button.addEventListener("click", () => {
    timelineIndex = index;
    renderTimeline();
  });
  markers.appendChild(button);
});

function selectNearest(clientY) {
  const rect = track.getBoundingClientRect();
  const relativeY = Math.max(0, Math.min(
    400,
    (clientY - rect.top) / rect.height * 400
  ));

  let nearest = 0;
  let distance = Infinity;

  positions.forEach((position, index) => {
    const difference = Math.abs(relativeY - position);
    if (difference < distance) {
      distance = difference;
      nearest = index;
    }
  });

  timelineIndex = nearest;
  renderTimeline();
}

track.addEventListener("pointerdown", event => {
  if (event.target.closest("button")) return;
  track.setPointerCapture(event.pointerId);
});

track.addEventListener("pointerup", event => {
  if (event.target.closest("button")) return;
  selectNearest(event.clientY);
});

renderCharacter();
renderTimeline();

// STORY 輪播

const stories = [
  {
    category: "01 / MAIN STORY",
    id: "modern",
    title: "現代",
    description: "",
    image: "./assets/images/story-modern.jpg"
  },
  {
    category: "02 / MAIN STORY",
    id: "yese",
    title: "葉塞大陸",
    description: "",
    image: "./assets/images/story-yese.jpg"
  },
  {
    category: "03 / MAIN STORY",
    id: "paradise",
    title: "樂園",
    description: "",
    image: "./assets/images/story-paradise.jpg"
  },
  {
    category: "04 / MAIN STORY",
    id: "spirit",
    title: "靈界",
    description: "",
    image: "./assets/images/story-spirit.jpg"
  },
  {
    category: "05 / MAIN STORY",
    id: "mist",
    title: "霧隱都市",
    description: "",
    image: "./assets/images/story-mist.jpg"
  },
  {
    category: "06 / MAIN STORY",
    id: "godforsaken",
    title: "神棄之地",
    description: "",
    image: "./assets/images/story-godforsaken.jpg"
  },
  {
    category: "07 / MAIN STORY",
    id: "empire",
    title: "千之帝國",
    description: "",
    image: "./assets/images/story-empire.jpg"
  }
];



let storyIndex = 0;

const storyImage = document.getElementById("storyImage");
const storyPagination = document.getElementById("storyPagination");

function renderStory() {
  const story = stories[storyIndex];

  document.getElementById("storyCategory").textContent = story.category;
  document.getElementById("storyTitle").textContent = story.title;
  document.getElementById("storyDescription").textContent = story.description;

  const storyUrl = `./story.html?id=${encodeURIComponent(story.id)}`;

const storyEntry = document.getElementById("storyEntry");

if (storyEntry) {
  storyEntry.href = storyUrl;
}

const viewAll = document.querySelector("#story .view-all");

if (viewAll) {
  viewAll.href = storyUrl;
}

  storyImage.style.backgroundImage = story.image
    ? `linear-gradient(to top, rgba(30,20,20,.25), transparent), url("${story.image}")`
    : "linear-gradient(145deg, #a48a83, #443735)";

  storyImage.querySelector("span").style.display =
    story.image ? "none" : "";

  storyPagination.innerHTML = "";

  stories.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "story-dot" + (index === storyIndex ? " active" : "");
    dot.setAttribute("aria-label", `切換到第 ${index + 1} 個故事`);
    dot.addEventListener("click", () => {
      storyIndex = index;
      renderStory();
    });
    storyPagination.appendChild(dot);
  });
}

function changeStory(step) {
  storyIndex = (storyIndex + step + stories.length) % stories.length;
  renderStory();
}

document.getElementById("storyPrev")
  .addEventListener("click", () => changeStory(-1));

document.getElementById("storyNext")
  .addEventListener("click", () => changeStory(1));

let storyTouchStartX = 0;

document.getElementById("storyVisual").addEventListener(
  "touchstart",
  event => {
    storyTouchStartX = event.changedTouches[0].screenX;
  },
  { passive: true }
);

document.getElementById("storyVisual").addEventListener(
  "touchend",
  event => {
    const distance =
      event.changedTouches[0].screenX - storyTouchStartX;

    if (Math.abs(distance) > 45) {
      changeStory(distance < 0 ? 1 : -1);
    }
  },
  { passive: true }
);

renderStory();


/* =====================================
   SECTION TRANSITION
   區塊內自由捲動，邊界平滑切換
===================================== */

(() => {
  const ids = [
    "home",
    "character",
    "timeline",
    "story",
    "paro",
    "other"
  ];

  const sections = ids
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const header = document.querySelector(".site-header");
  const footer = document.querySelector("footer");

  let animating = false;
  let touchStartY = 0;
  let touchStartX = 0;
  let lastWheelTime = 0;

  function headerHeight() {
    return header ? header.getBoundingClientRect().height : 0;
  }

  function topOf(element) {
    return window.scrollY +
      element.getBoundingClientRect().top;
  }

  function currentSectionIndex() {
    const position = window.scrollY + headerHeight() + 4;

    let index = 0;

    sections.forEach((section, i) => {
      if (topOf(section) <= position) {
        index = i;
      }
    });

    return index;
  }

  function scrollToPosition(target) {
    if (animating) return;

    animating = true;

    window.scrollTo({
      top: target,
      behavior: "smooth"
    });

    window.setTimeout(() => {
      animating = false;
    }, 750);
  }

  function handleDirection(direction) {
    if (animating) return false;

    const index = currentSectionIndex();
    const section = sections[index];

    if (!section) return false;

    const currentY = window.scrollY;
    const top = topOf(section);
    const bottom = top + section.offsetHeight;

    const visibleTop = currentY + headerHeight();
    const visibleBottom = currentY + window.innerHeight;

    const tolerance = 12;

    if (direction > 0) {
      // 還沒到本區塊底部：保留自然捲動
      if (visibleBottom < bottom - tolerance) {
        return false;
      }

      // 到達底部後，切換下一區塊
      const next = sections[index + 1];

      if (next) {
        scrollToPosition(
          Math.max(0, topOf(next) - headerHeight())
        );
        return true;
      }

      // 最後一頁可自然捲動至 footer
      return false;
    }

    if (direction < 0) {
      // 尚未回到本區塊頂端
      if (visibleTop > top + tolerance) {
        return false;
      }

      const previous = sections[index - 1];

      if (previous) {
        const previousTop = topOf(previous);
        const previousBottom =
          previousTop + previous.offsetHeight;

        const target = Math.max(
          previousTop - headerHeight(),
          previousBottom - window.innerHeight
        );

        scrollToPosition(target);
        return true;
      }
    }

    return false;
  }

  // 電腦：滑鼠滾輪、觸控板
  window.addEventListener("wheel", event => {
    if (event.ctrlKey || animating) {
      if (animating) event.preventDefault();
      return;
    }

    const now = Date.now();

    if (now - lastWheelTime < 90) return;
    lastWheelTime = now;

    const direction = Math.sign(event.deltaY);

    if (direction && handleDirection(direction)) {
      event.preventDefault();
    }
  }, { passive: false });

  // 手機：記錄手勢方向
  window.addEventListener("touchstart", event => {
    if (event.touches.length !== 1) return;

    touchStartY = event.touches[0].clientY;
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  window.addEventListener("touchend", event => {
    if (animating || event.changedTouches.length !== 1) {
      return;
    }

    const deltaY =
      touchStartY - event.changedTouches[0].clientY;

    const deltaX =
      touchStartX - event.changedTouches[0].clientX;

    // 橫向滑動交給人物、故事輪播
    if (Math.abs(deltaX) > Math.abs(deltaY)) return;

    if (Math.abs(deltaY) < 45) return;

    handleDirection(Math.sign(deltaY));
  }, { passive: true });

})();
