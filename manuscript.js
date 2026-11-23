(() => {
  const figure = document.querySelector('.imprint');
  const replay = figure.querySelector('.imprint-replay');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const lines = Array.from(figure.querySelectorAll('.ink-line'), line => {
    const text = line.textContent;
    const ink = document.createElement('span');
    line.dataset.full = text;
    ink.textContent = text;
    line.replaceChildren(ink);
    return {text, ink};
  });
  const length = lines.reduce((total, line) => total + line.text.length, 0);
  let frame;
  function write(count) {
    for (const {text, ink} of lines) {
      const visible = text.slice(0, Math.max(0, count));
      if (ink.textContent !== visible) ink.textContent = visible;
      count -= text.length;
    }
  }
  function setScene(scene) {
    if (figure.dataset.scene === scene) return;
    figure.dataset.scene = scene;
    if (scene === 'opening') delete figure.dataset.phase;
    else figure.dataset.phase = ['prepare', 'fade', 'done'].includes(scene) ? 'training' : 'sampling';
  }
  function finish() {
    cancelAnimationFrame(frame);
    write(length);
    setScene('done');
    replay.textContent = 'Replay animation';
  }
  function play() {
    if (motion.matches) return;
    const start = performance.now();
    const samplingStart = 1550;
    const guideStart = samplingStart + 2900;
    const entranceStart = guideStart + 1500;
    const typingStart = entranceStart + 700;
    const characterTime = 49;
    const samplingEnd = typingStart + length * characterTime + 550;
    const trainingStart = samplingEnd + 850;
    const fadeStart = trainingStart + 3250;
    const problemStart = fadeStart + 2200;
    write(0);
    setScene('opening');
    replay.textContent = 'Skip animation';
    function tick(now) {
      const elapsed = now - start;
      if (elapsed >= problemStart) { finish(); return; }
      if (elapsed >= fadeStart) setScene('fade');
      else if (elapsed >= trainingStart) setScene('prepare');
      else if (elapsed >= samplingEnd) setScene('sampled');
      else if (elapsed >= typingStart) setScene('writing');
      else if (elapsed >= entranceStart) setScene('enter');
      else if (elapsed >= guideStart) setScene('guide');
      else if (elapsed >= samplingStart) setScene('introduce');
      if (elapsed >= typingStart) write(Math.floor((elapsed - typingStart) / characterTime));
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  }
  replay.addEventListener('click', () => figure.dataset.scene === 'done' ? play() : finish());
  motion.addEventListener('change', () => {
    finish();
    replay.hidden = motion.matches;
  });
  if (motion.matches) finish();
  else {
    setScene('opening');
    write(0);
  }
  const dialog = document.querySelector('#training-explanation');
  document.querySelector('.explain-trigger').addEventListener('click', () => {
    dialog.showModal();
    dialog.scrollTop = 0;
    replay.hidden = motion.matches;
    if (motion.matches) finish();
    else play();
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => cancelAnimationFrame(frame));
})();
