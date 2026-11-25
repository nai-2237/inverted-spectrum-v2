
const profiles = {
  ayn: {
    name: "艾因",
    english: "AYN",
    intro: "這裡填寫艾因的人物簡介。",
    image: "./assets/images/ayn.jpg",

    
sections: [
  
{
  title: "基本資料",
  content: `
    <div class="profile-info-list">
      <div class="profile-info-row">
        <span>中文名</span>
        <span>艾因</span>
      </div>
      <div class="profile-info-row">
        <span>外文名</span>
        <span>AYN</span>
      </div>
      <div class="profile-info-row">
        <span>生日</span>
        <span>11月21日</span>
      </div>
      <div class="profile-info-row">
        <span>身長／手長</span>
        <span>179cm/22cm</span>
      </div>
      <div class="profile-info-row">
        <span>MBTI</span>
        <span>infp</span>
      </div>
      <div class="profile-info-row">
        <span>系所</span>
        <span>音樂系</span>
      </div>
    </div>
  `
},

  {
    title: "行為表現",
    content: "這裡填寫行為表現。"
  },
  
{
  title: "印象物",
  content: `
    <div class="profile-info-list">
      <div class="profile-info-row">
        <span>花飾</span>
        <span>玫瑰、虞美人</span>
      </div>
      <div class="profile-info-row">
        <span>色系</span>
        <span>赤紅色、黑白紅</span>
      </div>
      <div class="profile-info-row">
        <span>動物塑</span>
        <span>黑貓、狼</span>
      </div>
      <div class="profile-info-row">
        <span>表符</span>
        <span>🐈‍⬛</span>
      </div>
      <div class="profile-info-row">
        <span>其他</span>
        <span>可樂、蛋糕、巧克力、糖果、草莓、櫻桃、鋼琴、音樂、黑膠、遊戲、松果球、火、鯨魚、夢、紅白兔子</span>
      </div>
    </div>
  `
},

  {
    title: "關係網",
    content: "這裡填寫人物關係網。"
  },
  {
    title: "特殊之人",
    content: "對於穆綺來說，艾因於不同世界的同位體皆為「艾因」這個核心所構成，本質上是同根同源，但由於生長在不同的社會，因此形成各異價值觀與個性。但說到底艾因就是艾因，不管到了哪個世界，她依舊可以篤定地認出他，也會下意識地信任與幫助這些同位體們。\n雖說同源，不過唯有現代的艾因才是穆綺名正言順的戀人，其餘同位體更類似朋友之上且帶有複雜情感，憐憫、景仰、共鳴、服從⋯⋯參雜著的其他情感遠遠大於了愛本身。再結合穆綺出生地等因素，她必定會放棄長生，與現代艾因走完一輩子。"
  }
]

  },

  marlowe: {
    name: "穆綺",
    english: "MARLOWE",
    intro: "這裡填寫穆綺的人物簡介。",
    image: "./assets/images/marlowe.jpg",

    
sections: [
  {
  title: "基本資料",
  content: `
    <div class="profile-info-list">
      <div class="profile-info-row">
        <span>中文名</span>
        <span>穆綺</span>
      </div>
      <div class="profile-info-row">
        <span>外文名</span>
        <span>MARLOWE</span>
      </div>
      <div class="profile-info-row">
        <span>生日</span>
        <span>11月10日</span>
      </div>
      <div class="profile-info-row">
        <span>身長／手長</span>
        <span>157cm/17cm</span>
      </div>
      <div class="profile-info-row">
        <span>MBTI</span>
        <span>intp</span>
      </div>
      <div class="profile-info-row">
        <span>系所</span>
        <span>電影系</span>
      </div>
    </div>
  `
},
  {
    title: "行為表現",
    content: "這裡填寫行為表現。"
  },
  
{
  title: "印象物",
  content: `
    <div class="profile-info-list">
      <div class="profile-info-row">
        <span>花飾</span>
        <span>蒲公英、勿忘我</span>
      </div>
      <div class="profile-info-row">
        <span>色系</span>
        <span>薄荷綠、黑棕綠</span>
      </div>
      <div class="profile-info-row">
        <span>動物塑</span>
        <span>刺蝟、貓頭鷹</span>
      </div>
      <div class="profile-info-row">
        <span>表符</span>
        <span>🦔</span>
      </div>
      <div class="profile-info-row">
        <span>其他</span>
        <span>抹茶、咖啡、馬卡龍、冰淇淋、蘸水筆、鉛筆、畫紙、書、可視化、玻璃、泡沫、風、飛鳥、雕像</span>
      </div>
    </div>
  `
},

  {
    title: "關係網",
    content: "這裡填寫人物關係網。"
  },
  
{
  title: "旅者設定",
  content: "這裡填寫旅者設定。"
}

]

  }
};

const params = new URLSearchParams(window.location.search);
let currentProfile = params.get("id") === "marlowe"
  ? "marlowe"
  : "ayn";

function renderProfile() {
  const profile = profiles[currentProfile];

  document.title = `${profile.name} — Inverted Spectrum`;

  document.getElementById("profileName").textContent =
    profile.name;

  document.getElementById("profileEnglish").textContent =
    profile.english;

  document.getElementById("profileIntro").textContent =
    profile.intro;

  const art = document.getElementById("profileArt");

  const image = new Image();
  image.onload = () => {
    art.style.backgroundImage =
      `url("${profile.image}")`;
  };
  image.onerror = () => {
    art.style.backgroundImage =
      "linear-gradient(145deg, #a88e85, #55413b)";
  };
  image.src = profile.image;

  const container = document.getElementById("profileSections");
  container.replaceChildren();

  profile.sections.forEach((section, index) => {
    const entry = document.createElement("article");
    entry.className = "profile-entry";

    const number = document.createElement("span");
    number.className = "profile-entry-number";
    number.textContent = `0${index + 1} / PROFILE`;

    const title = document.createElement("h3");
    title.textContent = section.title;

    const content = document.createElement("div");
    content.className = "profile-entry-content";
    content.innerHTML = section.content;

    entry.append(number, title, content);
    container.appendChild(entry);
  });

  const next = currentProfile === "ayn" ? "穆綺" : "艾因";
  document.getElementById("switchCharacter").textContent =
    `${next} →`;
}

document.getElementById("switchCharacter")
  .addEventListener("click", () => {
    currentProfile =
      currentProfile === "ayn" ? "marlowe" : "ayn";

    const url = new URL(window.location.href);
    url.searchParams.set("id", currentProfile);
    window.history.replaceState({}, "", url);

    renderProfile();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

renderProfile();
