const VIDEO_BASE = './public/assets/videos/';
const VIDEO_STATES = {
  idle: '14.mp4',
  click: 'Video 13.mp4',
  focus: 'Video 8.mp4',
  look: 'Video 8.mp4',
  rest: 'Video 8.mp4',
  record: 'Video 11.mp4',
  complete:
    '女孩意识到计时结束，眼睛明显亮起来，露出开心笑容，轻轻握拳做一个小幅度“完成啦”的庆祝动作，随后看向用户点头。庆祝克制，不跳跃，不出现彩带、金币等元素。.mp4',
};

const DURATIONS = [15, 25, 45, 60];
const WEEK_DATA = [
  { day: '周一', minutes: 72 },
  { day: '周二', minutes: 88 },
  { day: '周三', minutes: 54 },
  { day: '周四', minutes: 120 },
  { day: '周五', minutes: 68 },
  { day: '周六', minutes: 48 },
  { day: '周日', minutes: 62 },
];

const state = {
  screen: 'home',
  durationIndex: 1,
  lastFocusMinutes: 25,
  completedMinutes: 25,
  stats: {
    todayMinutes: 50,
    todayCount: 2,
    streakDays: 7,
    completedCount: 18,
  },
  timer: null,
  guideTimers: [],
};

const root = document.getElementById('root');

const ICONS = {
  clock:
    '<g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l2 2"/></g>',
  chart:
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 18V6c0-.465 0-.697-.051-.888a1.5 1.5 0 0 0-1.06-1.06C12.697 4 12.464 4 12 4s-.697 0-.888.051a1.5 1.5 0 0 0-1.06 1.06C10 5.304 10 5.536 10 6v12c0 .465 0 .698.051.888a1.5 1.5 0 0 0 1.06 1.06c.191.052.424.052.889.052s.697 0 .888-.051a1.5 1.5 0 0 0 1.06-1.06C14 18.697 14 18.464 14 18m7-10V6c0-.465 0-.697-.051-.888a1.5 1.5 0 0 0-1.06-1.06C19.697 4 19.464 4 19 4s-.698 0-.888.051a1.5 1.5 0 0 0-1.06 1.06C17 5.304 17 5.536 17 6v2c0 .465 0 .697.051.888a1.5 1.5 0 0 0 1.06 1.06c.191.052.424.052.889.052s.698 0 .888-.051a1.5 1.5 0 0 0 1.06-1.06C21 8.696 21 8.464 21 8M7 12V6c0-.465 0-.697-.051-.888a1.5 1.5 0 0 0-1.06-1.06C5.696 4 5.464 4 5 4s-.697 0-.888.051a1.5 1.5 0 0 0-1.06 1.06C3 5.304 3 5.536 3 6v6c0 .465 0 .697.051.888a1.5 1.5 0 0 0 1.06 1.06C4.304 14 4.536 14 5 14s.697 0 .888-.051a1.5 1.5 0 0 0 1.06-1.06C7 12.697 7 12.464 7 12"/>',
  user:
    '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M20 21a7.53 7.53 0 0 0-7.005-6.934L12 14q-.531.015-1 .038c-3.7.181-6.716 3.268-7 6.962"/><circle cx="12" cy="7" r="4"/></g>',
  leaf:
    '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path stroke-linejoin="round" d="M7.646 15.71A6 6 0 0 1 7 13c0-3.215 2.5-5.5 6-6c4.082-.583 5.833-2.833 7-4c3.5 13-3 16-7 16a6 6 0 0 1-3-.803"/><path d="M3 21c.5-3 2.458-4.864 7-6c3.217-.804 5.463-2.82 7-4.945"/></g>',
  bell:
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.5 18a3.5 3.5 0 1 1-7 0m10.731 0H4.77a1.769 1.769 0 0 1-1.25-3.02l.602-.603A3 3 0 0 0 5 12.256V9.5a7 7 0 0 1 14 0v2.756a3 3 0 0 0 .879 2.121l.603.603a1.77 1.77 0 0 1-1.25 3.02"/>',
  timer:
    '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M11.08 13.152L8 7l5.42 4.28c.77.608.774 1.767.008 2.38a1.547 1.547 0 0 1-2.347-.508"/><path d="M5 4.82a10 10 0 0 0-3 7.158C2 17.513 6.477 22 12 22s10-4.487 10-10.022a10.02 10.02 0 0 0-8.013-9.825c-.836-.17-1.254-.254-1.62.047S12 2.987 12 3.96v1.002"/></g>',
  leafSolid:
    '<path fill="currentColor" d="M11.2 19.6c-.24-3.1-1.46-5.58-3.72-7.12c-1.86-1.27-4.02-1.54-5.7-1.38c.2 2.1 1.1 4.38 3.12 5.8c1.76 1.24 3.94 1.32 5.56.96c-.92-.9-2.16-1.66-3.74-2.18a.75.75 0 1 1 .47-1.42c1.8.6 3.22 1.47 4.25 2.58c.7-2.52 2.03-4.42 4.01-5.65c1.61-1 3.3-1.32 4.74-1.3c-.12 2.36-.9 4.82-2.8 6.35c-1.54 1.24-3.55 1.58-5.15 1.36c.18.62.3 1.25.36 1.9a.7.7 0 0 1-.64.75a.7.7 0 0 1-.76-.65Z"/>',
  timerSolid:
    '<path fill="currentColor" d="M12 2.25a.75.75 0 0 1 .75.75v.86A9.27 9.27 0 0 1 21.25 13A9.25 9.25 0 1 1 9.42 4.11V3a.75.75 0 0 1 .75-.75H12Zm0 4.1a6.65 6.65 0 1 0 0 13.3a6.65 6.65 0 0 0 0-13.3Zm-.6 3.1a.75.75 0 0 1 1.25-.55l2.9 2.66a.75.75 0 0 1-.08 1.17l-3.2 2.13a.75.75 0 0 1-1.17-.62l.3-4.79Z"/>',
};

function hugeIcon(name, className = '') {
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
}

function videoSrc(name) {
  return `${VIDEO_BASE}${encodeURIComponent(name)}`;
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

function render() {
  clearTimer();
  clearGuideAnimation();
  root.innerHTML = `<main class="app-shell"><section class="phone screen-${state.screen}">${screenMarkup()}</section></main>`;
  bindSharedVideos();
  if (state.screen === 'home') bindHome();
  if (state.screen === 'focus') bindTimer('focus', state.lastFocusMinutes);
  if (state.screen === 'rest') bindTimer('rest', 5);
  if (state.screen === 'complete') bindComplete();
  if (state.screen === 'records' || state.screen === 'me') bindBottomNav();
}

function screenMarkup() {
  if (state.screen === 'home') return homeMarkup();
  if (state.screen === 'focus') return timerMarkup('focus', state.lastFocusMinutes);
  if (state.screen === 'rest') return timerMarkup('rest', 5);
  if (state.screen === 'complete') return completeMarkup();
  if (state.screen === 'records') return recordsMarkup();
  return meMarkup();
}

function statusBar(hidden = false) {
  return `
    <div class="status-bar ${hidden ? 'is-hidden' : ''}">
      <span>9:41</span>
      <div class="status-icons" aria-hidden="true">
        <span class="signal"><i></i><i></i><i></i><i></i></span>
        <span class="wifi"></span>
        <span class="battery"></span>
      </div>
    </div>`;
}

function characterVideo(videoState, className, loop = true) {
  const loopAttr = loop ? 'loop' : '';
  return `
    <button class="character-hit ${className}" data-character aria-label="IP 互动">
      <video class="character-video" data-character-video data-state="${videoState}" src="${videoSrc(VIDEO_STATES[videoState])}" autoplay muted playsinline ${loopAttr} preload="auto"></video>
    </button>
    <div class="video-preload" aria-hidden="true">
      ${Object.values(VIDEO_STATES).map((file) => `<video src="${videoSrc(file)}" muted playsinline preload="auto"></video>`).join('')}
    </div>`;
}

function bindSharedVideos() {
  document.querySelectorAll('[data-character-video]').forEach((video) => {
    video.addEventListener('canplay', () => {
      video.classList.add('is-loaded');
    });
    video.play().catch(() => {});
  });
}

function swapCharacterVideo(nextState, loop = true, onEnded) {
  const video = document.querySelector('[data-character-video]');
  if (!video) return;
  video.classList.remove('is-loaded');
  video.loop = loop;
  video.src = videoSrc(VIDEO_STATES[nextState]);
  video.dataset.state = nextState;
  video.onended = onEnded || null;
  video.oncanplay = () => {
    video.classList.add('is-loaded');
  };
  video.play().catch(() => {});
}

function clearGuideAnimation() {
  state.guideTimers.forEach((timerId) => {
    clearTimeout(timerId);
    clearInterval(timerId);
  });
  state.guideTimers = [];
  document.querySelector('[data-start]')?.classList.remove('is-guided');
}

function syncHomeGuide(video, startButton) {
  const time = video.currentTime || 0;
  const isHomeIdle = video.dataset.state === 'idle' || video.dataset.state === 'idle-click';
  const shouldGuide = isHomeIdle && time >= 5.15 && time <= 7.65;
  startButton.classList.toggle('is-guided', shouldGuide);
}

function startHomeGuideWatcher() {
  const video = document.querySelector('[data-character-video]');
  const startButton = document.querySelector('[data-start]');
  if (!video || !startButton) return;
  clearGuideAnimation();
  const tick = () => syncHomeGuide(video, startButton);
  tick();
  state.guideTimers.push(setInterval(tick, 80));
}

function playIdleOpening(seconds = 3) {
  const video = document.querySelector('[data-character-video]');
  if (!video) return;
  video.onended = null;
  video.ontimeupdate = null;
  video.loop = false;
  video.src = videoSrc(VIDEO_STATES.idle);
  video.dataset.state = 'idle-click';

  const restoreIdle = () => {
    video.ontimeupdate = null;
    video.onended = null;
    video.loop = true;
    video.dataset.state = 'idle';
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  video.onloadedmetadata = () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  };
  video.ontimeupdate = () => {
    if (video.currentTime >= seconds) restoreIdle();
  };
  video.onended = restoreIdle;
  state.guideTimers.push(setTimeout(restoreIdle, seconds * 1000 + 120));
  video.play().catch(() => {});
}

function homeMarkup() {
  const selectedMinutes = DURATIONS[state.durationIndex];
  return `
    <div class="page home-page">
      ${statusBar()}
      <h1 class="home-title">晚上好，今天也一起专注吧 <span>♣</span></h1>
      <div class="home-orb"></div>
      ${characterVideo('idle', 'home-character')}
      <section class="duration-picker" aria-label="选择专注时长">
        <button class="arrow-button" data-prev aria-label="减少时长"><span></span></button>
        <div>
          <div class="duration-number">${selectedMinutes}:00</div>
          <div class="duration-dots">
            ${DURATIONS.map((duration, index) => `<span class="${index === state.durationIndex ? 'active' : ''}"></span>`).join('')}
          </div>
        </div>
        <button class="arrow-button next" data-next aria-label="增加时长"><span></span></button>
      </section>
      <button class="primary-button" data-start>开始专注</button>
      <button class="today-line" data-records>今日专注 <strong>${state.stats.todayMinutes}</strong> min · <strong>${state.stats.todayCount}</strong> 次</button>
    </div>`;
}

function bindHome() {
  const startButton = document.querySelector('[data-start]');
  startHomeGuideWatcher();

  document.querySelector('[data-prev]').addEventListener('click', () => {
    state.durationIndex = (state.durationIndex - 1 + DURATIONS.length) % DURATIONS.length;
    render();
  });
  document.querySelector('[data-next]').addEventListener('click', () => {
    state.durationIndex = (state.durationIndex + 1) % DURATIONS.length;
    render();
  });
  startButton.addEventListener('click', () => {
    clearGuideAnimation();
    state.lastFocusMinutes = DURATIONS[state.durationIndex];
    state.screen = 'focus';
    render();
  });
  document.querySelector('[data-records]').addEventListener('click', () => {
    state.screen = 'records';
    render();
  });
  document.querySelector('[data-character]').addEventListener('click', () => {
    playIdleOpening(3);
  });
}

function timerMarkup(mode, minutes) {
  const circumference = 2 * Math.PI * 143;
  return `
    <div class="page timer-page">
      ${statusBar(true)}
      <div class="focus-pill"><span></span><b data-focus-label>${mode === 'rest' ? '休息中' : '专注中'}</b></div>
      <section class="timer-ring" aria-label="倒计时">
        <svg viewBox="0 0 320 320" role="img" aria-label="专注进度">
          <circle class="ring-track" cx="160" cy="160" r="143"></circle>
          <circle class="ring-progress" data-ring cx="160" cy="160" r="143" stroke-dasharray="${circumference}" stroke-dashoffset="0"></circle>
          <circle class="ring-dot" data-ring-dot cx="160" cy="17" r="5"></circle>
        </svg>
        <div class="timer-copy">
          <p><span class="leaf-icon"></span>${mode === 'rest' ? '轻轻休息，准备生长' : '沉浸当下，专注成长'}</p>
          <strong data-time>${formatTime(minutes * 60)}</strong>
          <small>${minutes}:00</small>
        </div>
      </section>
      ${characterVideo(mode === 'rest' ? 'rest' : 'focus', 'focus-character')}
      <div class="focus-segments">
        ${Array.from({ length: 14 }).map(() => '<span></span>').join('')}
        <i data-segment-dot style="left:0%"></i>
      </div>
      <div class="timer-actions">
        <button data-pause class="soft-action" aria-label="暂停"><span class="pause-icon"></span><em>暂停</em></button>
        <span class="action-divider"></span>
        <button data-end class="soft-action" aria-label="结束"><span class="stop-icon"></span><em>结束</em></button>
      </div>
    </div>`;
}

function bindTimer(mode, minutes) {
  const totalSeconds = minutes * 60;
  const timer = {
    mode,
    totalSeconds,
    remaining: totalSeconds,
    paused: false,
    endAt: Date.now() + totalSeconds * 1000,
    pauseStarted: null,
    interval: null,
    lookTimeout: null,
  };
  state.timer = timer;

  const pauseButton = document.querySelector('[data-pause]');
  const endButton = document.querySelector('[data-end]');

  const finish = () => {
    if (mode === 'rest') {
      state.screen = 'home';
    } else {
      completeRound(minutes);
    }
    render();
  };

  const update = () => {
    if (!timer.paused) timer.remaining = Math.max(0, (timer.endAt - Date.now()) / 1000);
    updateTimerDom(timer);
    if (timer.remaining <= 0) finish();
  };

  pauseButton.addEventListener('click', () => {
    timer.paused = !timer.paused;
    if (timer.paused) {
      timer.pauseStarted = Date.now();
      pauseButton.innerHTML = '<span class="play-icon"></span><em>继续</em>';
      pauseButton.setAttribute('aria-label', '继续');
      document.querySelector('[data-focus-label]').textContent = '已暂停';
    } else {
      timer.endAt += Date.now() - timer.pauseStarted;
      pauseButton.innerHTML = '<span class="pause-icon"></span><em>暂停</em>';
      pauseButton.setAttribute('aria-label', '暂停');
      document.querySelector('[data-focus-label]').textContent = mode === 'rest' ? '休息中' : '专注中';
    }
  });

  endButton.addEventListener('click', () => {
    if (mode === 'rest') {
      state.screen = 'home';
    } else {
      const elapsed = Math.max(1, Math.round((totalSeconds - timer.remaining) / 60));
      completeRound(elapsed);
    }
    render();
  });

  const characterButton = document.querySelector('[data-character]');
  if (characterButton) {
    characterButton.addEventListener('click', () => {
      const returnState = mode === 'rest' ? 'rest' : 'focus';
      swapCharacterVideo('click', false, () => swapCharacterVideo(returnState, true));
    });
  }

  if (mode === 'focus') scheduleLook(timer);
  update();
  timer.interval = window.setInterval(update, 250);
}

function updateTimerDom(timer) {
  const progress = timer.remaining / timer.totalSeconds;
  const circumference = 2 * Math.PI * 143;
  const completed = 1 - progress;
  const angle = -Math.PI / 2 + progress * Math.PI * 2;
  document.querySelector('[data-time]').textContent = formatTime(timer.remaining);
  document.querySelector('[data-ring]').style.strokeDashoffset = `${circumference * completed}`;
  document.querySelector('[data-ring-dot]').setAttribute('cx', `${160 + 143 * Math.cos(angle)}`);
  document.querySelector('[data-ring-dot]').setAttribute('cy', `${160 + 143 * Math.sin(angle)}`);
  document.querySelector('[data-segment-dot]').style.left = `${Math.min(100, Math.max(0, completed * 100))}%`;
  document.querySelectorAll('.focus-segments span').forEach((segment, index) => {
    segment.classList.toggle('done', index / 13 <= completed);
  });
}

function scheduleLook(timer) {
  window.clearTimeout(timer.lookTimeout);
  if (timer.paused) return;
  timer.lookTimeout = window.setTimeout(() => {
    if (state.screen !== 'focus' || timer.paused) return;
    swapCharacterVideo('look', false, () => {
      swapCharacterVideo('focus', true);
      if (state.timer === timer) scheduleLook(timer);
    });
  }, 35000 + Math.random() * 22000);
}

function clearTimer() {
  if (!state.timer) return;
  window.clearInterval(state.timer.interval);
  window.clearTimeout(state.timer.lookTimeout);
  state.timer = null;
}

function completeRound(minutes) {
  state.completedMinutes = minutes;
  state.stats.todayMinutes += minutes;
  state.stats.todayCount += 1;
  state.stats.completedCount += 1;
  state.screen = 'complete';
}

function completeMarkup() {
  return `
    <div class="page complete-page">
      ${statusBar(true)}
      <section class="complete-copy">
        <h2>完成啦！<img src="./public/assets/ui/complete-leaf.png" alt="" /></h2>
        <p><strong>${state.completedMinutes}</strong> min 专注完成</p>
      </section>
      <div class="celebration-stars" aria-hidden="true">${Array.from({ length: 9 }).map(() => '<span></span>').join('')}</div>
      <div class="home-orb complete-orb"></div>
      ${characterVideo('complete', 'complete-character', false)}
      <p class="complete-stats"><span class="check-icon"></span> 今日已完成 <strong>${state.stats.todayCount}</strong> 次 · <strong>${state.stats.todayMinutes}</strong> min</p>
      <div class="complete-actions">
        <button class="outline-button" data-rest>休息 5 分钟</button>
        <button class="primary-button compact" data-again>再来一轮</button>
      </div>
    </div>`;
}

function bindComplete() {
  document.querySelector('[data-rest]').addEventListener('click', () => {
    state.screen = 'rest';
    render();
  });
  document.querySelector('[data-again]').addEventListener('click', () => {
    state.screen = 'focus';
    render();
  });
}

function recordsMarkup() {
  const total = WEEK_DATA.reduce((sum, item) => sum + item.minutes, 0);
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return `
    <div class="page records-page">
      ${statusBar(true)}
      <button class="menu-button" aria-label="菜单"><span></span><span></span><span></span></button>
      <header class="records-header">
        <h1>专注记录</h1>
        <p>每一次专注，都是成长的脚印 <span>♣</span></p>
      </header>
      <img class="record-character-cutout" src="./public/assets/ui/record-character-cutout.png" alt="" />
      <section class="week-summary">
        <h2>本周专注 <button aria-label="切换周期"></button></h2>
        <p><strong>${hours}</strong><span>h</span> <strong>${mins}</strong><span>min</span></p>
      </section>
      ${chartMarkup()}
      <section class="record-metrics">
        <div>${hugeIcon('leafSolid', 'record-metric-icon')}<p>连续专注</p><strong>${state.stats.streakDays}</strong><em>天</em></div>
        <i></i>
        <div>${hugeIcon('timerSolid', 'record-metric-icon')}<p>完成番茄钟</p><strong>${state.stats.completedCount}</strong><em>个</em></div>
      </section>
      ${bottomNav('records')}
    </div>`;
}

function chartMarkup() {
  return `
    <section class="chart" aria-label="本周柱状图">
      <div class="chart-grid"><span>2h</span><span>1h</span><span>0h</span></div>
      <div class="bars">
        ${WEEK_DATA.map((item, index) => `
          <div class="bar-item">
            <div class="bar-track"><span style="--bar-height:${(item.minutes / 120) * 100}%; --bar-index:${index};"></span></div>
            <p>${item.day}</p>
          </div>`).join('')}
      </div>
    </section>`;
}

function bottomNav(current) {
  return `
    <nav class="bottom-nav" aria-label="底部导航">
      <button class="${current === 'home' ? 'active' : ''}" data-nav="home">${hugeIcon('clock', 'nav-icon')}开始专注</button>
      <button class="${current === 'records' ? 'active' : ''}" data-nav="records">${hugeIcon('chart', 'nav-icon')}专注记录</button>
      <button class="${current === 'me' ? 'active' : ''}" data-nav="me">${hugeIcon('user', 'nav-icon')}我的</button>
    </nav>`;
}

function bindBottomNav() {
  document.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', () => {
      state.screen = button.dataset.nav;
      render();
    });
  });
}

function meMarkup() {
  return `
    <div class="page me-page">
      ${statusBar(true)}
      <header class="me-header">
        <h1>我的</h1>
        <p>和小绿一起，把专注慢慢养成习惯 ${hugeIcon('leaf', 'inline-leaf')}</p>
      </header>
      <section class="me-profile" aria-label="个人资料">
        <div class="me-avatar"><img src="./public/assets/ui/record-character-cutout.png" alt="" /></div>
        <div>
          <h2>晚上好</h2>
          <p>今日状态不错，适合再完成一轮。</p>
        </div>
      </section>
      <section class="me-stats" aria-label="专注统计">
        <div><strong>${state.stats.todayMinutes}</strong><span>min</span><p>今日专注</p></div>
        <div><strong>${state.stats.streakDays}</strong><span>天</span><p>连续专注</p></div>
        <div><strong>${state.stats.completedCount}</strong><span>个</span><p>完成番茄钟</p></div>
      </section>
      <section class="me-list" aria-label="偏好设置">
        <button>${hugeIcon('clock', 'me-list-icon')}<strong>默认专注时长</strong><em>${DURATIONS[state.durationIndex]} min</em></button>
        <button>${hugeIcon('leaf', 'me-list-icon')}<strong>陪伴动画</strong><em>已开启</em></button>
        <button>${hugeIcon('bell', 'me-list-icon')}<strong>休息提醒</strong><em>5 min</em></button>
      </section>
      ${bottomNav('me')}
    </div>`;
}

render();
