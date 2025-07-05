const tileFilenames = [
  "123",
  "124",
  "128",
  "163",
  "164",
  "168",
  "173",
  "174",
  "178",
  "523",
  "524",
  "528",
  "563",
  "564",
  "568",
  "573",
  "574",
  "578",
  "923",
  "924",
  "928",
  "963",
  "964",
  "968",
  "973",
  "974",
  "978",
];

const tileBank = document.getElementById("tile-bank");

const tileGroups = {
  1: document.querySelector(".group-1"),
  5: document.querySelector(".group-5"),
  9: document.querySelector(".group-9"),
};

tileFilenames.forEach((name) => {
  const prefix = parseInt(name[0]); // 시작 숫자 추출
  const img = document.createElement("img");
  img.src = `tiles/${name}.png`;
  img.className = "tile";
  img.id = `tile-${name}`;
  img.dataset.code = name;

  tileGroups[prefix]?.appendChild(img);
});
let selectedTile = null;

// 타일 이벤트 등록
function registerTileEvents() {
  document.querySelectorAll(".tile").forEach((tile) => {
    tile.addEventListener("dragstart", (e) => {
      selectedTile = tile;
      e.dataTransfer.setData("text/plain", tile.id);
    });

    tile.addEventListener("touchstart", (e) => {
      selectedTile = tile;
      tile.classList.add("selected");
    });
  });
}

registerTileEvents();
function getTileGroup(code) {
  const prefix = parseInt(code[0]);
  return document.querySelector(`.group-${prefix}`);
}
// 슬롯 드롭 이벤트
document.querySelectorAll(".slot").forEach((slot) => {
  slot.addEventListener("dragover", (e) => e.preventDefault());

  slot.addEventListener("drop", (e) => {
    if (slot.firstChild) return;

    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const tile = document.getElementById(id);
    slot.innerHTML = "";
    slot.appendChild(tile);
    selectedTile = null;
    calculateScore();
  });
});

// 터치로 놓기 (전역)
document.addEventListener("touchend", (e) => {
  if (!selectedTile) return;

  const touch = e.changedTouches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);

  if (target?.classList.contains("slot")) {
    // 이미 타일이 있으면 놓지 않음
    if (target.firstChild) return;

    target.appendChild(selectedTile);
    calculateScore();
  } else if (target?.id === "tile-bank" || target?.closest("#tile-bank")) {
    tileBank.appendChild(selectedTile);
  }

  selectedTile.classList.remove("selected");
  selectedTile = null;
});

// 뱅크 드래그 복귀
tileBank.addEventListener("dragover", (e) => e.preventDefault());
tileBank.addEventListener("drop", (e) => {
  e.preventDefault();
  const tileId = e.dataTransfer.getData("text/plain");
  const tile = document.getElementById(tileId);
  const group = getTileGroup(tile.dataset.code);
  group?.appendChild(tile);
  selectedTile = null;
});

// 점수 계산 관련
const verticalLines = [
  [3, 8, 13],
  [1, 6, 11, 16],
  [0, 4, 9, 14, 18],
  [2, 7, 12, 17],
  [5, 10, 15],
];
const diagonalRightLines = [
  [0, 1, 3],
  [2, 4, 6, 8],
  [5, 7, 9, 11, 13],
  [10, 12, 14, 16],
  [15, 17, 18],
];
const diagonalLeftLines = [
  [0, 2, 5],
  [1, 4, 7, 10],
  [3, 6, 9, 12, 15],
  [8, 11, 14, 17],
  [13, 16, 18],
];

function calculateScore() {
  let total = 0;
  const list = document.getElementById("score-list");
  list.innerHTML = "";

  const dirs = [
    { name: "세로", lines: verticalLines, idx: 0 },
    { name: "↙ 대각선", lines: diagonalRightLines, idx: 1 },
    { name: "↘ 대각선", lines: diagonalLeftLines, idx: 2 },
  ];

  dirs.forEach(({ name, lines, idx }) => {
    lines.forEach((line, i) => {
      const nums = line.map((id) => {
        const slot = document.getElementById(`slot-${id}`);
        return slot?.firstChild?.dataset.code?.[idx] || null;
      });

      if (nums.every((n) => n && n === nums[0])) {
        const score = parseInt(nums[0]) * nums.length;
        total += score;

        const li = document.createElement("li");
        li.textContent = `${name} 줄 ${i + 1} → ${score}점`;
        list.appendChild(li);
      }
    });
  });

  document.getElementById("total-score").textContent = `총 점수: ${total}`;
}

function resetBoard() {
  document.querySelectorAll(".slot").forEach((slot) => {
    const tile = slot.firstChild;
    if (tile) {
      const group = getTileGroup(tile.dataset.code);
      group?.appendChild(tile); // ← 그룹으로 복귀!
    }
  });
  calculateScore();
}
