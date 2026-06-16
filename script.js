const $ = (selector) => document.querySelector(selector);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const envTop = $('#envTop');
const envLeft = $('#envLeft');
const envRight = $('#envRight');
const envBottom = $('#envBottom');
const wax = $('#wax');
const envelope = $('#envelope');
const screenLeft = $('#screenLeft');
const screenRight = $('#screenRight');
const partitionWrap = $('#partitionWrap');
const groom = $('#groom');
const bride = $('#bride');
const sceneCaption = $('#sceneCaption');
const ceremonyHeading = $('#ceremonyHeading');
const progress = $('#progress');

function updateScrollAnimations() {
  const y = window.scrollY;
  const h = window.innerHeight;
  const doc = document.documentElement.scrollHeight - h;
  progress.style.width = `${(y / doc) * 100}%`;

  // Scene 1: full page envelope opening
  const envelopeSection = $('.envelope-scroll');
  const envelopeRect = envelopeSection.getBoundingClientRect();
  const envP = clamp((-envelopeRect.top) / (h * 1.25), 0, 1);
  const envEase = 1 - Math.pow(1 - envP, 3);

  envLeft.style.transform = `rotateY(${-118 * envEase}deg) translateX(${-160 * envEase}px)`;
  envRight.style.transform = `rotateY(${118 * envEase}deg) translateX(${160 * envEase}px)`;
  envTop.style.transform = `rotateX(${145 * envEase}deg) translateY(${-45 * envEase}px)`;
  envBottom.style.transform = `translateY(${34 * envEase}px)`;
  wax.style.opacity = `${1 - envEase * 1.3}`;
  wax.style.transform = `scale(${1 - envEase * 0.65}) translateY(${envEase * 140}px) rotate(${envEase * 180}deg)`;
  envelope.style.transform = `scale(${1 + envEase * 0.08}) translateY(${-envEase * 26}px)`;

  // Scene 2: Nikah partition, couple sitting -> coming closer -> standing
  const nikahRect = $('.nikah-scroll').getBoundingClientRect();
  const nikahP = clamp((h - nikahRect.top) / (h * 2.25), 0, 1);
  const curtainOpen = clamp(nikahP / 0.36, 0, 1);
  const coupleMove = clamp((nikahP - 0.18) / 0.42, 0, 1);
  const standP = clamp((nikahP - 0.55) / 0.3, 0, 1);
  const fadeDetails = clamp((nikahP - 0.78) / 0.18, 0, 1);

  screenLeft.style.transform = `translateX(${-82 * curtainOpen}%) rotateY(${18 * curtainOpen}deg)`;
  screenRight.style.transform = `translateX(${82 * curtainOpen}%) rotateY(${-18 * curtainOpen}deg)`;
  screenLeft.style.opacity = `${1 - curtainOpen * 0.12}`;
  screenRight.style.opacity = `${1 - curtainOpen * 0.12}`;
  partitionWrap.style.opacity = `${1 - curtainOpen * 1.1}`;
  partitionWrap.style.transform = `translateX(-50%) translateY(${-30 * curtainOpen}px) scale(${1 - curtainOpen * 0.18})`;

  const groomX = -25 + coupleMove * 188;
  const brideX = 25 - coupleMove * 188;
  const yLift = 34 * standP;
  const scale = 1 + standP * 0.12;
  groom.style.transform = `translateX(${groomX}px) translateY(${-yLift}px) scale(${scale})`;
  bride.style.transform = `translateX(${brideX}px) translateY(${-yLift}px) scale(${scale})`;
  groom.classList.toggle('standing', standP > 0.42);
  bride.classList.toggle('standing', standP > 0.42);
  groom.classList.toggle('seated', standP <= 0.42);
  bride.classList.toggle('seated', standP <= 0.42);

  ceremonyHeading.style.opacity = `${1 - fadeDetails * 0.9}`;
  ceremonyHeading.style.transform = `translateX(-50%) translateY(${-35 * fadeDetails}px)`;
  sceneCaption.textContent = nikahP < 0.25
    ? 'Scroll to open the Nikah partition'
    : nikahP < 0.56
      ? 'The bride and groom come closer'
      : nikahP < 0.82
        ? 'They stand together for their new beginning'
        : 'Continue to the invitation details';

  document.querySelectorAll('.reveal, .card').forEach((element) => {
    if (element.getBoundingClientRect().top < h * 0.82) element.classList.add('visible');
  });
}

window.addEventListener('scroll', updateScrollAnimations, { passive: true });
window.addEventListener('resize', updateScrollAnimations);
updateScrollAnimations();

// Floating petals
const petals = $('#petals');
for (let i = 0; i < 36; i++) {
  const petal = document.createElement('i');
  petal.className = 'petal';
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.animationDuration = `${7 + Math.random() * 10}s`;
  petal.style.animationDelay = `${-Math.random() * 12}s`;
  petal.style.setProperty('--x', `${Math.random() * 150 - 75}px`);
  petals.appendChild(petal);
}

// Countdown
const targetDate = new Date('2026-08-01T12:00:00+01:00');
function updateCountdown() {
  let diff = Math.max(0, targetDate - new Date());
  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const values = [days, hours, minutes, seconds];
  document.querySelectorAll('#countdown strong').forEach((item, index) => {
    item.textContent = String(values[index]).padStart(index === 0 ? 3 : 2, '0');
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Simple audio tone toggle placeholder, replace with an mp3 if needed
let ctx;
let osc;
let gain;
let playing = false;
$('#musicBtn').addEventListener('click', () => {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    osc = ctx.createOscillator();
    gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 432;
    gain.gain.value = 0;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
  }
  playing = !playing;
  gain.gain.setTargetAtTime(playing ? 0.025 : 0, ctx.currentTime, 0.08);
  $('#musicBtn').classList.toggle('on', playing);
  $('#musicBtn').textContent = playing ? '♫' : '♪';
});
