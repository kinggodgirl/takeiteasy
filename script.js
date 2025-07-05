// 1. 타일 파일 이름 목록
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

// 2. 타일 뱅크에 이미지 추가
const tileBank = document.getElementById("tile-bank");

tileFilenames.forEach((name) => {
  const img = document.createElement("img");
  img.src = `tiles/${name}.png`;
  img.className = "tile";
  img.id = `tile-${name}`;
  img.draggable = true;
  img.dataset.code = name; // 숫자 정보 저장
  tileBank.appendChild(img);
});

let selectedTile = null;
let touchStartTarget = null;

// 모든 타일 이벤트 처리
document.querySelectorAll(".tile").forEach((tile) => {
  // 드래그
  tile.setAttribute("draggable", true);
  tile.addEventListener("dragstart", (e) => {
    selectedTile = tile;
    e.dataTransfer.setData("text/plain", tile.id);
  });

  // 터치 시작 → 어떤 타일이 선택되었는지 기억
  tile.addEventListener("touchstart", (e) => {
    selectedTile = tile;
    touchStartTarget = e.target;
    tile.classList.add("selected");
  });
});

// 화면 전체에 터치 종료 이벤트 추가 (슬롯이 터치 이벤트를 못 받는 경우 대비)
document.addEventListener("touchend", (e) => {
  if (!selectedTile) return;

  const touch = e.changedTouches[0];
  const elemAtTouch = document.elementFromPoint(touch.clientX, touch.clientY);

  if (!elemAtTouch) return;

  // 슬롯에 떨어뜨리면
  if (elemAtTouch.classList.contains("slot")) {
    elemAtTouch.innerHTML = "";
    elemAtTouch.appendChild(selectedTile);
    calculateScore();
  }

  // 타일 뱅크에 떨어뜨리면
  else if (
    elemAtTouch.id === "tile-bank" ||
    elemAtTouch.closest("#tile-bank")
  ) {
    document.getElementById("tile-bank").appendChild(selectedTile);
  }

  selectedTile.classList.remove("selected");
  selectedTile = null;
  touchStartTarget = null;
});
function resetBoard() {
  const tileBank = document.getElementById("tile-bank");
  document.querySelectorAll(".slot").forEach((slot) => {
    const tile = slot.firstChild;
    if (tile) {
      tile.style.width = ""; // 👉 보드에서 수정된 스타일 리셋
      tileBank.appendChild(tile);
    }
  });
}
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
  let totalScore = 0;
  const scoreList = document.getElementById("score-list");
  scoreList.innerHTML = ""; // 초기화

  const directions = [
    { name: "세로", lines: verticalLines, index: 0 },
    { name: "↙ 대각선", lines: diagonalRightLines, index: 1 },
    { name: "↘ 대각선", lines: diagonalLeftLines, index: 2 },
  ];

  directions.forEach(({ name, lines, index }) => {
    lines.forEach((line, lineIdx) => {
      const numbers = line.map((slotId) => {
        const slot = document.getElementById(`slot-${slotId}`);
        const tile = slot?.firstChild;
        return tile?.dataset.code?.[index] || null;
      });

      if (numbers.every((n) => n && n === numbers[0])) {
        const lineScore = parseInt(numbers[0]) * numbers.length;
        totalScore += lineScore;

        const li = document.createElement("li");
        li.textContent = `${name} 줄 ${lineIdx + 1} → ${lineScore}점`;
        scoreList.appendChild(li);
      }
    });
  });

  document.getElementById("total-score").textContent = `총 점수: ${totalScore}`;
}
