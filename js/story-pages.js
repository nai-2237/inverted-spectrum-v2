
(async () => {
  const params = new URLSearchParams(location.search);
  const requested = params.get("id") || "modern";
  const error = document.getElementById("storyError");

  try {
    const response = await fetch("./data/worlds.json", {
      cache: "no-cache"
    });

    if (!response.ok) {
      throw new Error("無法讀取世界線資料");
    }

    const worlds = await response.json();

    const index = worlds.findIndex(
      world => world.id === requested
    );

    if (index === -1) {
      throw new Error("找不到這條世界線");
    }

    const world = worlds[index];

    const num = String(index + 1).padStart(2, "0");

    document.title =
      `${world.title} — Inverted Spectrum`;

    document.getElementById("worldVolume").textContent =
      `VOL. ${num} / ${String(worlds.length).padStart(2, "0")}`;

    document.getElementById("worldNumber").textContent =
      `MAIN STORY — ${num}`;

    document.getElementById("worldTitle").textContent =
      world.title;

    document.getElementById("worldEnglish").textContent =
      world.english || "";

    document.getElementById("worldPage").textContent =
      `— ${num} —`;

    const description =
      document.getElementById("worldDescription");

    if (world.description) {
      description.textContent = world.description;
      description.hidden = false;
    }

    const previous =
      worlds[(index - 1 + worlds.length) % worlds.length];

    const next =
      worlds[(index + 1) % worlds.length];

    document.getElementById("previousWorld").href =
      `./story.html?id=${encodeURIComponent(previous.id)}`;

    document.getElementById("nextWorld").href =
      `./story.html?id=${encodeURIComponent(next.id)}`;

    document.querySelectorAll("[data-category]").forEach(link => {
      link.href =
        `./story-category.html?id=${encodeURIComponent(world.id)}` +
        `&category=${encodeURIComponent(link.dataset.category)}`;
    });

  } catch (err) {
    document.getElementById("worldTitle").textContent =
      "暫時無法顯示";

    error.textContent =
      `${err.message}。請透過 VS Code Live Server 或部署網址開啟，不要直接雙擊 HTML 檔。`;

    error.hidden = false;

    document.getElementById("worldContents").hidden = true;
  }
})();

