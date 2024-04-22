/*
clit - v1.0.6

OG Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain via @ https://www.npmjs.com/package/clit
Code refactored by @Veeeetzzzz


Please refer to README.md to see what this is about.
*/

let running = true;
let lastMeasure = Date.now();
let accumulated = 0;

function log(message) {
  // This ANSI sequence cleans the screen.
  process.stdout.write('\u001B[2J\u001B[0;0f');
  process.stdout.write('Timer started. Press CTRL+Z to pause/resume and CTRL+C to quit.\n');
  process.stdout.write(message);
}

function formatTime(milliseconds) {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
  const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);

  let output = `${padZero(minutes)}:${padZero(seconds)}`;

  if (hours) {
    output = `${hours}:${output}`;
  }

  return output;
}

function padZero(value) {
  return value < 10 ? `0${value}` : value;
}

function updateTimer() {
  const now = Date.now();
  accumulated += now - lastMeasure;
  lastMeasure = now;
  log(formatTime(accumulated));
}

const timer = setInterval(updateTimer, 1000);

process.on('SIGTSTP', () => {
  if (running) {
    updateTimer();
    clearInterval(timer);
    running = false;
    log(`Paused at ${formatTime(accumulated)}`);
  } else {
    lastMeasure = Date.now();
    setInterval(updateTimer, 1000);
    running = true;
    log(`Resumed at ${formatTime(accumulated)}`);
  }
});

process.on('SIGINT', () => {
  log(`Stopped after ${formatTime(accumulated)}\n`);
  process.exit();
});
