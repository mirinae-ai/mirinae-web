/**
 * 브랜드 래스터 이미지를 만든다 — `public/og.png`, `public/apple-touch-icon.png`.
 *
 *   node scripts/brand-images.mjs
 *
 * SVG 로 두지 않는 것은 받는 쪽 때문이다. 슬랙 · 카카오 · X 의 미리보기는 SVG 를 읽지
 * 않고, iOS 홈 화면 아이콘도 PNG 만 받는다. 그래서 여기서 한 번 구워 `public/` 에 넣어
 * 두고 커밋한다 — 빌드 때마다 굽지 않는다. 브랜드가 바뀔 때만 다시 돌리면 된다.
 *
 * 굽는 일은 설치된 Chrome 에게 시킨다. 헤드리스로 띄워 CDP 로 스크린샷 한 장을 받는다.
 */
import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/** 앱 배경과 같은 흰색. 순백(#fff)보다 반 톤 낮아 화면에서 덜 튄다. */
const PAPER = '#fcfcfc';

/**
 * Miru 원본 (assets/icons/miru/*.svg 를 한 장으로 합친 것).
 * 정지 상태라 애니메이션 레이어 분리 없이 그대로 겹쳐 둔다.
 */
const MIRU = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="SIZE" height="SIZE">
  <defs>
    <filter id="s" x="9.18" y="93.86" width="99.42" height="21.09" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="2.00846"/>
    </filter>
    <linearGradient id="b" x1="13.7" y1="45.66" x2="101.07" y2="94.86" gradientUnits="userSpaceOnUse">
      <stop stop-color="#AABCF4"/><stop offset=".34" stop-color="#8882E6"/>
      <stop offset=".7" stop-color="#5B4FC8"/><stop offset="1" stop-color="#3D347E"/>
    </linearGradient>
    <radialGradient id="g" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(80.98 45.66) rotate(90) scale(36.15 42.18)">
      <stop stop-color="#ECB4D9" stop-opacity=".86"/><stop offset="1" stop-color="#ECB4D9" stop-opacity="0"/>
    </radialGradient>
    <mask id="m" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="4" y="28" width="120" height="72">
      <path d="M11.6917 91.3483C-1.86542 81.306 3.65784 65.2383 19.2234 62.2256C14.2023 47.6643 25.7509 36.1156 40.8144 39.1283C48.3461 24.0648 72.4477 24.5669 78.9752 39.6304C94.0386 31.5966 111.613 41.6389 107.596 58.7108C123.663 60.2171 129.689 77.2891 117.638 88.8377C106.089 100.888 26.7552 103.399 11.6917 91.3483Z" fill="#fff"/>
    </mask>
  </defs>
  <g filter="url(#s)">
    <path d="M58.8906 110.931C84.1258 110.931 104.583 108.009 104.583 104.403C104.583 100.798 84.1258 97.876 58.8906 97.876C33.6553 97.876 13.1981 100.798 13.1981 104.403C13.1981 108.009 33.6553 110.931 58.8906 110.931Z" fill="#4D438A" fill-opacity=".15"/>
  </g>
  <path d="M11.6917 91.3483C-1.86542 81.306 3.65784 65.2383 19.2234 62.2256C14.2023 47.6643 25.7509 36.1156 40.8144 39.1283C48.3461 24.0648 72.4477 24.5669 78.9752 39.6304C94.0386 31.5966 111.613 41.6389 107.596 58.7108C123.663 60.2171 129.689 77.2891 117.638 88.8377C106.089 100.888 26.7552 103.399 11.6917 91.3483Z" fill="url(#b)"/>
  <g mask="url(#m)">
    <path d="M83.4942 84.3186C104.57 84.3186 121.655 67.2335 121.655 46.1578C121.655 25.0822 104.57 7.99707 83.4942 7.99707C62.4185 7.99707 45.3334 25.0822 45.3334 46.1578C45.3334 67.2335 62.4185 84.3186 83.4942 84.3186Z" fill="url(#g)"/>
    <path d="M6.6705 88.3358C31.7763 98.8802 96.5492 101.893 122.659 85.8252L126.174 109.927H2.65357L6.6705 88.3358Z" fill="#332A74" fill-opacity=".18"/>
  </g>
  <path d="M57.8863 86.7288C58.8569 86.7288 59.6437 86.0994 59.6437 85.3229C59.6437 84.5464 58.8569 83.917 57.8863 83.917C56.9157 83.917 56.1289 84.5464 56.1289 85.3229C56.1289 86.0994 56.9157 86.7288 57.8863 86.7288Z" fill="#2F275C"/>
  <path d="M52.8652 81.055C54.1131 81.055 55.1247 79.8186 55.1247 78.2934C55.1247 76.7682 54.1131 75.5317 52.8652 75.5317C51.6173 75.5317 50.6057 76.7682 50.6057 78.2934C50.6057 79.8186 51.6173 81.055 52.8652 81.055Z" fill="#2F275C"/>
  <path d="M62.4054 81.3058C63.5146 81.3058 64.4138 80.1818 64.4138 78.7952C64.4138 77.4087 63.5146 76.2847 62.4054 76.2847C61.2961 76.2847 60.3969 77.4087 60.3969 78.7952C60.3969 80.1818 61.2961 81.3058 62.4054 81.3058Z" fill="#2F275C"/>
  <path d="M12.1938 76.7868C7.17267 75.2804 4.66209 71.2635 4.66209 67.2466" stroke="#463A8E" stroke-width="3.01269" stroke-linecap="round"/>
  <path d="M102.072 23.0606C104.583 18.0394 110.106 16.5331 114.123 19.5458C118.14 23.0606 115.63 28.5839 109.604 30.0902C103.579 28.5839 100.064 26.5754 102.072 23.0606Z" fill="#EAB4D7"/>
  <path d="M117.136 41.6388C118.522 41.6388 119.647 40.5148 119.647 39.1283C119.647 37.7417 118.522 36.6177 117.136 36.6177C115.749 36.6177 114.625 37.7417 114.625 39.1283C114.625 40.5148 115.749 41.6388 117.136 41.6388Z" fill="#9DBEF1"/>
</svg>`;

const page = (w, h, miruSize) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0}
  body{width:${w}px;height:${h}px;background:${PAPER};
       display:flex;align-items:center;justify-content:center}
</style></head><body>${MIRU.replaceAll('SIZE', String(miruSize))}</body></html>`;

const IMAGES = [
  // 오픈그래프 표준 크기. 흰 바탕 가운데 Miru 하나.
  { file: 'public/og.png', width: 1200, height: 630, miru: 360 },
  // iOS 홈 화면. 투명 배경을 주면 검정 위에 얹혀 망가져서 바탕을 깔아 굽는다.
  { file: 'public/apple-touch-icon.png', width: 180, height: 180, miru: 150 },
];

const PORT = 9333;
const dir = await mkdtemp(join(tmpdir(), 'mirinae-brand-'));
const chrome = execFile(CHROME, [
  '--headless', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${join(dir, 'profile')}`,
  'about:blank',
]);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await wait(2500);

const targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const pending = new Map();
const events = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) pending.get(m.id)(m.result);
  if (m.method && events.has(m.method)) events.get(m.method)();
};
const send = (method, params = {}) =>
  new Promise((r) => {
    const n = ++id;
    pending.set(n, r);
    ws.send(JSON.stringify({ id: n, method, params }));
  });

await send('Page.enable');

for (const image of IMAGES) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: image.width, height: image.height, deviceScaleFactor: 1, mobile: false,
  });
  const loaded = new Promise((r) => events.set('Page.loadEventFired', r));
  const html = page(image.width, image.height, image.miru);
  await send('Page.navigate', {
    url: `data:text/html;charset=utf-8,${encodeURIComponent(html)}`,
  });
  await loaded;
  await wait(400);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile(image.file, Buffer.from(shot.data, 'base64'));
  console.log(`${image.file}  ${image.width}x${image.height}`);
}

ws.close();
chrome.kill();

// 크롬이 프로필에 아직 쓰고 있는 중이면 지우다 걸린다. 이미지는 다 나왔으므로
// 임시 폴더 정리에 실패한다고 스크립트가 실패할 이유는 없다.
await new Promise((r) => chrome.once('exit', r));
await rm(dir, { recursive: true, force: true }).catch(() => {});
