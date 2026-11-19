// Začetek 12. november 2026 mesec 10 = november ker se meseci štejejo od 0
const zacetek = new Date(2026, 10, 12, 0, 0, 0);

const elD = document.getElementById("d");
const elH = document.getElementById("h");
const elM = document.getElementById("m");
const elS = document.getElementById("s");

function posodobi() {
  const razlika = Math.max(0, Math.floor((Date.now() - zacetek.getTime()) / 1000));

  elD.textContent = Math.floor(razlika / 86400);
  elH.textContent = Math.floor((razlika % 86400) / 3600);
  elM.textContent = Math.floor((razlika % 3600) / 60);
  elS.textContent = razlika % 60;
}

posodobi();
setInterval(posodobi, 1000);

// ===== Zvezdnato nebo =====
const platno = document.getElementById("nebo");
const ctx = platno.getContext("2d");
let W, H, zvezde = [], utrinek = null;

function nastavi() {
  const r = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  platno.width = W * r;
  platno.height = H * r;
  ctx.setTransform(r, 0, 0, r, 0, 0);

  zvezde = [];
  const stevilo = Math.floor((W * H) / 5000);
  for (let i = 0; i < stevilo; i++) {
    zvezde.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.4,
      osnova: Math.random() * 0.3 + 0.4,    // 40 do 70 % svetlosti
      zacetek: -1,                          // -1 = trenutno ne utripa
      trajanje: 0,
      roza: Math.random() < 0.2
    });
  }
}

function narisi(t) {
  ctx.clearRect(0, 0, W, H);

  for (const z of zvezde) {
    // naključni utripi
    if (z.zacetek < 0 && Math.random() < 0.0006) {
      z.zacetek = t;
      z.trajanje = 2500 + Math.random() * 2500;   // 2,5 do 5 sekund
    }

    let svetlost = z.osnova;
    let polmer = z.r;
    let val = 0;

    if (z.zacetek >= 0) {
      const p = (t - z.zacetek) / z.trajanje;
      if (p >= 1) {
        z.zacetek = -1;
      } else {
        val = Math.sin(p * Math.PI) ** 2;
        svetlost = z.osnova + (1 - z.osnova) * val;
        polmer = z.r * (1 + 0.7 * val);       // do 1,7x večja
      }
    }

    const barva = z.roza ? "255, 170, 210" : "255, 255, 255";

    // sij samo, ko zvezda utripa
    if (val > 0) {
      ctx.shadowBlur = 16 * val;
      ctx.shadowColor = `rgba(${barva}, ${val})`;
    }

    ctx.beginPath();
    ctx.arc(z.x, z.y, polmer, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${barva}, ${svetlost})`;
    ctx.fill();

    ctx.shadowBlur = 0;   // ponastavi, da sij ne vpliva na ostale
  }

  // občasen utrinek
  if (!utrinek && Math.random() < 0.004) {
    utrinek = { x: Math.random() * W * 0.8 + W * 0.2, y: Math.random() * H * 0.4, dolzina: 0 };
  }
  if (utrinek) {
    utrinek.dolzina += 9;
    const sx = utrinek.x - utrinek.dolzina;
    const sy = utrinek.y + utrinek.dolzina * 0.55;
    const g = ctx.createLinearGradient(sx, sy, sx + 90, sy - 50);
    g.addColorStop(0, "rgba(255,255,255,0)");
    g.addColorStop(1, "rgba(255,255,255,0.9)");
    ctx.strokeStyle = g;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + 90, sy - 50);
    ctx.stroke();
    if (utrinek.dolzina > W) utrinek = null;
  }

  requestAnimationFrame(narisi);
}

window.addEventListener("resize", nastavi);
nastavi();
requestAnimationFrame(narisi);