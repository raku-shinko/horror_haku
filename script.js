// 🔊 Preload assets
const ghostImg = new Image();
ghostImg.id = 'ghost';
ghostImg.src = 'assets/ghost-face.png';

const scream = new Audio('assets/scream.m4a');
// 放大音檔的音量
const ctx   = new (window.AudioContext || window.webkitAudioContext)();
// audio 當成媒體來源
const source = ctx.createMediaElementSource(scream);
// 建立 GainNode 放大音量
const gainNode = ctx.createGain();
gainNode.gain.value = 3.5;   // 200 %，視需要
// 5) 串接：source ➜ gain ➜ destination
source.connect(gainNode).connect(ctx.destination);

// 🌑 初始 DOM
const landing = document.getElementById('landing');
const enterBtn = document.getElementById('enterBtn');

enterBtn.addEventListener('click', startChallenge);

function startChallenge() {
  // 1. 清空畫面
  landing.remove();
  document.body.style.cursor = 'default';

  // 2. 倒數動畫
  const tl = gsap.timeline({ onComplete: showGhost });

  for (let n = 5; n >= 1; n--) {
    tl.call(spawnNumber, [n]); // 每秒呼叫一次
    tl.to({}, { duration: 1 }); // 佔位 1s
  }
}

function spawnNumber(num) {
  const el = document.createElement('div');
  el.className = 'count-num';
  el.textContent = num;
  document.body.appendChild(el);

  // GSAP：從透明縮小到放大再消失
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.3 },
    { opacity: 1, scale: 1.4, duration: 0.5, ease: 'power2.out',
      onComplete: () => gsap.to(el, {
        opacity: 0,
        scale: 2,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => el.remove()
      })
    }
  );
}

// 3. 顯示鬼臉並播放音效
function showGhost() {
  document.body.appendChild(ghostImg);
  // 若還在 suspended, 先打開水閥
  if (ctx.state === 'suspended') {
    ctx.resume().then(() => scream.play());
  } else {
    scream.play();
  }
}
