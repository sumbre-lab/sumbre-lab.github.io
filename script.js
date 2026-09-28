const benchmarkData = {
  classification: [
    ["Spectral features", 34.9], ["MFCCs", 45.6], ["Mean spectrogram", 55.6],
    ["AVES-core", 68.0], ["BioLingual", 71.3], ["AVES-bio", 75.1], ["Wav2Vec2.0 · OW", 81.1]
  ],
  detection: [
    ["Spectral features", 26.3], ["MFCCs", 33.6], ["Mean spectrogram", 47.7],
    ["AVES-core", 57.4], ["BioLingual", 66.5], ["AVES-bio", 65.0], ["Wav2Vec2.0 · OW", 75.6]
  ]
};

const chart = document.querySelector(".chart");
function renderChart(metric) {
  chart.innerHTML = benchmarkData[metric].map(([name, value], index, rows) => `
    <div class="bar-row ${index === rows.length - 1 ? "highlight" : ""}">
      <span>${name}</span><div class="bar-track"><div class="bar-fill" style="--width:${value}%"></div></div><span class="bar-value">${value.toFixed(1)}</span>
    </div>`).join("");
}
renderChart("classification");

document.querySelectorAll(".benchmark-tabs button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".benchmark-tabs button").forEach(item => { item.classList.remove("active"); item.setAttribute("aria-selected", "false"); });
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    renderChart(button.dataset.metric);
  });
});

const workflow = document.querySelector("[data-workflow]");
if (workflow) {
  const tabs = [...workflow.querySelectorAll("[data-workflow-step]")];
  const panels = [...workflow.querySelectorAll("[data-workflow-panel]")];
  const status = workflow.querySelector("[data-workflow-status]");
  const playButton = workflow.querySelector(`[data-workflow-action="play"]`);
  const pauseButton = workflow.querySelector(`[data-workflow-action="pause"]`);
  const resetButton = workflow.querySelector(`[data-workflow-action="reset"]`);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeStep = 0;
  let timer = null;
  let wantsPlayback = !reducedMotion;
  let workflowVisible = false;

  const updateControls = () => {
    const playing = Boolean(timer);
    playButton.classList.toggle("active", playing);
    pauseButton.classList.toggle("active", !playing);
    workflow.classList.toggle("is-playing", playing);
    playButton.setAttribute("aria-pressed", String(playing));
    pauseButton.setAttribute("aria-pressed", String(!playing));
  };

  const showStep = index => {
    activeStep = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === activeStep;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel, panelIndex) => {
      const active = panelIndex === activeStep;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
    status.textContent = `Step ${activeStep + 1} of ${tabs.length}`;
  };

  const stopTimer = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
    updateControls();
  };

  const startTimer = () => {
    stopTimer();
    if (!wantsPlayback || !workflowVisible || reducedMotion) return;
    timer = window.setInterval(() => showStep(activeStep + 1), 3200);
    updateControls();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      showStep(index);
      if (wantsPlayback) startTimer();
    });
    tab.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = (index + direction + tabs.length) % tabs.length;
      showStep(next);
      tabs[next].focus();
      if (wantsPlayback) startTimer();
    });
  });

  playButton.addEventListener("click", () => {
    wantsPlayback = true;
    startTimer();
  });
  pauseButton.addEventListener("click", () => {
    wantsPlayback = false;
    stopTimer();
  });
  resetButton.addEventListener("click", () => {
    showStep(0);
    wantsPlayback = !reducedMotion;
    startTimer();
  });

  const workflowObserver = new IntersectionObserver(entries => {
    workflowVisible = entries[0].isIntersecting;
    if (workflowVisible) startTimer();
    else stopTimer();
  }, { threshold: .25 });

  showStep(0);
  updateControls();
  workflowObserver.observe(workflow);
}

const citationCode = document.querySelector(".citation-code");
const citationCopy = document.querySelector(".citation-copy");
if (citationCode && citationCopy) {
  const citationText = citationCode.textContent;
  const citationCopyLabel = citationCopy.querySelector("span");
  citationCopy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(citationText);
      citationCopyLabel.textContent = "Copied ✓";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(citationCode);
      selection.removeAllRanges();
      selection.addRange(range);
      citationCopyLabel.textContent = "Citation selected";
    }
    window.setTimeout(() => {
      citationCopyLabel.textContent = "Copy BibTeX";
    }, 1800);
  });
}

const menu = document.querySelector("#site-nav");
const menuButton = document.querySelector(".menu-toggle");
menuButton.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => { menu.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false"); }));

function updateScrollUi() {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.querySelector(".progress span").style.width = `${max ? scrollY / max * 100 : 0}%`;
}
window.addEventListener("scroll", updateScrollUi, { passive: true });
updateScrollUi();


// Interactive hero whistle field.
(() => {
  const canvas = document.querySelector("#heroWhistleCanvas");
  const hero = canvas && canvas.closest(".hero");
  if (!canvas || !hero) return;

  const context = canvas.getContext("2d", { alpha: true });
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tracks = [
    { y: .07, amplitude: 40, period: 820, phase: .08, speed: 58, type: 0, color: [102, 126, 234], alpha: .055 },
    { y: .19, amplitude: 34, period: 960, phase: .33, speed: 47, type: 5, color: [118, 75, 162], alpha: .045 },
    { y: .32, amplitude: 46, period: 900, phase: .56, speed: 64, type: 1, color: [0, 113, 227], alpha: .056 },
    { y: .45, amplitude: 36, period: 1020, phase: .79, speed: 51, type: 8, color: [134, 134, 139], alpha: .043 },
    { y: .58, amplitude: 43, period: 870, phase: .20, speed: 60, type: 3, color: [102, 126, 234], alpha: .052 },
    { y: .71, amplitude: 39, period: 980, phase: .45, speed: 54, type: 9, color: [118, 75, 162], alpha: .044 },
    { y: .84, amplitude: 48, period: 840, phase: .68, speed: 68, type: 4, color: [0, 113, 227], alpha: .055 },
    { y: .96, amplitude: 35, period: 1040, phase: .90, speed: 49, type: 11, color: [134, 134, 139], alpha: .042 }
  ];

  tracks.forEach(track => { track.offset = track.phase * track.period; });

  const pointer = {
    x: 0, y: 0, targetX: 0, targetY: 0,
    strength: 0, targetStrength: 0
  };

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let lastTime = performance.now();
  let animationFrame = 0;
  let visible = true;

  const fract = value => value - Math.floor(value);

  // Stylized centerlines traced from the OpenWhistle spectrograms used on this page.
  // Coordinates are normalized and smoothly interpolated below.
  const whistleContours = [
    [[0, .52], [.08, .34], [.34, .10], [.60, -.25], [.72, -.72], [.78, -.91], [.86, -.88], [.92, -.34], [1, .62]],
    [[0, .58], [.07, .18], [.15, -.66], [.28, -.86], [.43, -.56], [.62, -.12], [.70, .12], [.74, .68], [.90, .75], [1, .88]],
    [[0, .64], [.12, .43], [.30, .20], [.54, -.08], [.76, -.46], [1, -.90]],
    [[0, .55], [.16, .40], [.37, .24], [.60, .04], [.72, -.17], [.78, -.83], [.86, -.85], [.92, -.35], [1, .66]],
    [[0, .18], [.07, .60], [.14, .34], [.18, -.45], [.40, -.44], [.63, .02], [.68, .55], [1, .56]],
    // Signature and non-signature whistles from the dataset overview figure.
    [[0, .45], [.12, .52], [.18, -.35], [.28, -.55], [.54, -.35], [.63, .10], [.72, .12], [.77, .65], [1, .82]],
    [[0, -.78], [.18, -.63], [.38, -.35], [.58, -.05], [.82, .48], [1, .75]],
    [[0, .35], [.08, .20], [.12, -.30], [.25, -.48], [.52, -.42], [.68, -.15], [.70, .32], [1, .35]],
    [[0, .50], [.12, .05], [.30, -.25], [.55, -.45], [.72, -.44], [.86, -.20], [1, .55]],
    [[0, -.60], [.16, -.10], [.22, .05], [.55, .20], [.72, .30], [.76, .75], [1, .78]],
    [[0, .40], [.14, .05], [.35, -.20], [.60, -.05], [.78, .10], [1, .35]],
    [[0, .30], [.12, -.65], [.25, -.95], [.38, -.30], [.45, .75], [.55, .85], [1, .82]]
  ];

  function whistleShape(u, type) {
    const points = whistleContours[type % whistleContours.length];
    let index = 0;
    while (index < points.length - 2 && u > points[index + 1][0]) index += 1;

    const p0 = points[Math.max(0, index - 1)];
    const p1 = points[index];
    const p2 = points[Math.min(points.length - 1, index + 1)];
    const p3 = points[Math.min(points.length - 1, index + 2)];
    const span = Math.max(.0001, p2[0] - p1[0]);
    const t = Math.max(0, Math.min(1, (u - p1[0]) / span));
    const t2 = t * t;
    const t3 = t2 * t;
    const slope1 = (p2[1] - p0[1]) / Math.max(.0001, p2[0] - p0[0]);
    const slope2 = (p3[1] - p1[1]) / Math.max(.0001, p3[0] - p1[0]);

    return (2 * t3 - 3 * t2 + 1) * p1[1]
      + (t3 - 2 * t2 + t) * span * slope1
      + (-2 * t3 + 3 * t2) * p2[1]
      + (t3 - t2) * span * slope2;
  }

  function sample(track, x, time) {
    const depth = (track.phase - .5) * 29;
    const pointerX = width ? pointer.x / width - .5 : 0;
    const pointerY = height ? pointer.y / height - .5 : 0;
    const worldX = x + track.offset + pointerX * depth * pointer.strength;
    const contourPosition = worldX / track.period + track.phase;
    const u = fract(contourPosition);
    const segment = Math.floor(contourPosition);
    const contourIndex = ((track.type + segment * 5) % whistleContours.length + whistleContours.length) % whistleContours.length;
    const drift = Math.sin(time * .00042 + track.phase * 8) * 6;
    const flex = 1 + Math.sin(time * .00078 + track.phase * 11) * .07;
    let y = track.y * height + whistleShape(u, contourIndex) * track.amplitude * flex + drift
      + pointerY * depth * .52 * pointer.strength;

    const dx = x - pointer.x;
    const dy = y - pointer.y;
    const influence = pointer.strength * Math.exp(
      -(dx * dx) / (2 * 235 * 235) - (dy * dy) / (2 * 155 * 155)
    );
    y += (pointer.y - y) * influence * .15;
    const presence = Math.pow(Math.sin(Math.PI * u), .65);
    return { y, influence, presence };
  }

  function color(track, alpha) {
    return "rgba(" + track.color[0] + "," + track.color[1] + "," + track.color[2] + "," + alpha + ")";
  }

  function drawTrack(track, time) {
    const step = width < 720 ? 16 : 11;
    let previous = sample(track, -step, time);

    for (let x = 0; x <= width + step; x += step) {
      const current = sample(track, x, time);
      const focus = (previous.influence + current.influence) * .5;
      context.beginPath();
      context.moveTo(x - step, previous.y);
      context.lineTo(x, current.y);
      const presence = (previous.presence + current.presence) * .5;
      context.strokeStyle = color(track, (track.alpha + focus * .22) * (.04 + presence * .96));
      context.lineWidth = .68 + focus * 1.15;
      context.lineCap = "round";
      context.stroke();
      previous = current;
    }

  }

  function draw(time, delta) {
    context.clearRect(0, 0, width, height);

    const follow = Math.min(1, delta * 9);
    pointer.x += (pointer.targetX - pointer.x) * follow;
    pointer.y += (pointer.targetY - pointer.y) * follow;
    pointer.strength += (pointer.targetStrength - pointer.strength) * Math.min(1, delta * 6);

    if (pointer.strength > .01) {
      const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 280);
      glow.addColorStop(0, "rgba(102,126,234," + (.022 * pointer.strength) + ")");
      glow.addColorStop(1, "rgba(102,126,234,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
    }

    tracks.forEach(track => {
      if (!reducedMotion) track.offset = (track.offset + track.speed * delta) % track.period;
      drawTrack(track, time);
    });
  }

  function loop(time) {
    animationFrame = 0;
    const delta = Math.min((time - lastTime) / 1000, .04);
    lastTime = time;
    draw(time, delta);
    if (visible && !reducedMotion) animationFrame = requestAnimationFrame(loop);
  }

  function start() {
    if (animationFrame || reducedMotion || !visible) return;
    lastTime = performance.now();
    animationFrame = requestAnimationFrame(loop);
  }

  function stop() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    if (!pointer.targetX) {
      pointer.x = pointer.targetX = width * .5;
      pointer.y = pointer.targetY = height * .5;
    }
    draw(performance.now(), 0);
  }

  hero.addEventListener("pointermove", event => {
    const bounds = canvas.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    if (x >= 0 && x <= width && y >= 0 && y <= height) {
      pointer.targetX = x;
      pointer.targetY = y;
      pointer.targetStrength = 1;
    } else {
      pointer.targetStrength = 0;
    }
  }, { passive: true });

  hero.addEventListener("pointerleave", () => { pointer.targetStrength = 0; });

  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting && !document.hidden;
    if (visible) start(); else stop();
  }, { threshold: .01 });
  observer.observe(canvas);

  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden && canvas.getBoundingClientRect().bottom > 0;
    if (visible) start(); else stop();
  });

  new ResizeObserver(resize).observe(canvas);
  resize();
  if (reducedMotion) draw(performance.now(), 0); else start();
})();
