// --- Section registry ---
const SECTION_SLUGS = [
  '01-primeros-pasos',
  '02-dtos-validacion',
  '03-brands-crud',
  '04-build-produccion',
  '05-mongodb-pokedex',
  '06-seed-paginacion',
  '07-variables-entorno',
  '08-typeorm-postgres',
  '09-relaciones-typeorm',
  '10-carga-archivos',
  '11-autenticacion',
  '12-documentacion-openapi',
  '13-websockets',
  '14-desplegar-produccion',
  '15-despedida',
];

const STORAGE_KEY = 'nestjs-guide-v3';
let SECTIONS = [];
let state = {};
let currentSection = 0;
let currentLesson = 0;

// --- Theme ---
function initTheme() {
  const isDark = localStorage.getItem('nestjs-dark-mode') === 'true';
  document.documentElement.classList.toggle('dark', isDark);
  updateThemeIcon(isDark);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('nestjs-dark-mode', String(isDark));
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  document.getElementById('sun-icon').classList.toggle('hidden', !isDark);
  document.getElementById('moon-icon').classList.toggle('hidden', isDark);
}

// --- State ---
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function getSectionKey(si) { return `s${si}`; }

function completedSections() {
  return SECTIONS.filter((_, i) => state[getSectionKey(i)]?.done).length;
}

// --- Navigation ---
function buildNav() {
  const nav = document.getElementById('nav');
  nav.innerHTML = '';

  SECTIONS.forEach((s, i) => {
    const done = state[getSectionKey(i)]?.done;
    const active = i === currentSection;
    const el = document.createElement('div');

    let cls = 'flex items-center gap-2.5 px-4 py-2.5 cursor-pointer border-l-4 transition-all duration-150 text-sm ';
    if (active) {
      cls += 'border-l-accent bg-red-50 dark:bg-slate-700 text-accent font-semibold';
    } else {
      cls += 'border-l-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200';
    }

    el.className = cls;
    el.innerHTML = `
      <span class="font-mono text-xs opacity-50 flex-shrink-0">${String(i + 1).padStart(2, '0')}</span>
      <div class="w-1.5 h-1.5 rounded-full flex-shrink-0 ${done ? 'bg-done dark:bg-green-400' : active ? 'bg-accent' : 'bg-slate-300 dark:bg-slate-600'}"></div>
      <span class="leading-snug">${s.title}</span>
      ${done ? '<span class="ml-auto text-done dark:text-green-400 text-xs flex-shrink-0">✓</span>' : ''}
    `;
    el.onclick = () => { currentSection = i; currentLesson = 0; render(); closeSidebar(); };
    nav.appendChild(el);
  });

  const done = completedSections();
  const total = SECTIONS.length;
  document.getElementById('prog-label').textContent = `${done} / ${total}`;
  document.getElementById('prog-fill').style.width = Math.round((done / total) * 100) + '%';
}

// --- Code blocks ---
function codeBlock(obj, id) {
  if (!obj) return '';
  return `
    <div class="bg-gray-900 dark:bg-black rounded-xl my-5 overflow-hidden border border-gray-800">
      <div class="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
        <span class="font-mono text-xs text-gray-400 uppercase tracking-wider">${obj.lang}${obj.label ? ' — ' + obj.label : ''}</span>
        <button class="font-mono text-xs text-gray-400 hover:text-white bg-transparent border border-gray-700 hover:border-gray-500 cursor-pointer px-2 py-0.5 rounded transition-all" onclick="copyCode('code-${id}')">copiar</button>
      </div>
      <pre id="code-${id}" class="px-5 py-5 overflow-x-auto font-mono text-sm leading-relaxed text-gray-100">${obj.content}</pre>
    </div>`;
}

function copyCode(id) {
  const el = document.getElementById(id);
  navigator.clipboard.writeText(el.innerText).then(() => {
    const btn = el.previousElementSibling.querySelector('button');
    const original = btn.textContent;
    btn.textContent = '✓ copiado';
    setTimeout(() => btn.textContent = original, 1500);
  });
}

// --- Lecture tabs ---
function buildLectureTabs(s) {
  if (s.lectures.length <= 1) return '';
  return `
    <div class="flex gap-0 flex-wrap border-b border-slate-200 dark:border-slate-700 mb-8 -mx-6 md:-mx-12 px-6 md:px-12">
      ${s.lectures.map((lec, li) => `
        <button
          onclick="goToLesson(${li})"
          class="px-3 py-2.5 text-xs font-mono border-b-2 transition-all -mb-px whitespace-nowrap ${li === currentLesson
            ? 'border-accent text-accent font-semibold'
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}"
        ><span class="opacity-50">${String(li + 1).padStart(2, '0')}</span> ${lec.heading}</button>
      `).join('')}
    </div>`;
}

// --- Main render ---
function render() {
  if (!SECTIONS.length) return;
  buildNav();

  const s = SECTIONS[currentSection];
  const l = s.lectures[currentLesson];
  const isLastLesson = currentLesson === s.lectures.length - 1;
  const isDone = state[getSectionKey(currentSection)]?.done;

  // Quiz
  let quizHtml = '';
  if (l.quiz) {
    const q = l.quiz;
    const answered = state[`q-${currentSection}-${currentLesson}`];
    quizHtml = `
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 my-8">
        <div class="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">✎ Comprueba tu entendimiento</div>
        <div class="text-base font-bold mb-4 text-slate-900 dark:text-white">${q.q}</div>
        <div class="space-y-2">
          ${q.options.map((opt, oi) => {
            let cls = 'p-3 border-2 rounded-lg text-sm font-mono transition-all ';
            if (answered !== undefined) {
              if (oi === q.correct) cls += 'border-done bg-green-50 dark:bg-green-900/20 text-done dark:text-green-400';
              else if (oi === answered) cls += 'border-accent bg-red-50 dark:bg-red-900/20 text-accent dark:text-red-400';
              else cls += 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500';
            } else {
              cls += 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:border-accent dark:hover:border-accent cursor-pointer';
            }
            return `<div class="${cls}" ${answered === undefined ? `onclick="answerQuiz(${oi})"` : ''}>${opt}</div>`;
          }).join('')}
        </div>
        ${answered !== undefined ? `
          <div class="mt-4 p-3.5 rounded-lg text-sm leading-relaxed ${answered === q.correct
            ? 'bg-green-50 dark:bg-green-900/20 text-done dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/20 text-accent dark:text-red-400'}">
            ${answered === q.correct ? '✓ ' : '✗ Incorrecto. '}${q.feedback}
          </div>` : ''}
      </div>`;
  }

  const completeBtn = isLastLesson ? `
    <button
      onclick="markDone()"
      class="font-mono text-sm px-4 py-2 rounded-lg border-2 transition-all ${isDone
        ? 'bg-done text-white border-done cursor-default'
        : 'border-done text-done bg-green-50 dark:bg-green-900/10 dark:text-green-400 hover:bg-done hover:text-white'}">
      ${isDone ? '✓ Sección completada' : 'Marcar como completada'}
    </button>` : '<div></div>';

  const isFirst = currentSection === 0 && currentLesson === 0;
  const isLast = currentSection === SECTIONS.length - 1 && isLastLesson;

  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="mb-6">
      <div class="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
        Sección ${currentSection + 1} de ${SECTIONS.length}
        ${s.lectures.length > 1 ? `· Lección ${currentLesson + 1} de ${s.lectures.length}` : ''}
      </div>
      <h1 class="text-3xl md:text-4xl font-bold leading-tight mb-3 text-slate-900 dark:text-white">${s.title}</h1>
      <p class="text-base text-slate-600 dark:text-slate-300 leading-relaxed">${s.desc}</p>
    </div>
    <hr class="border-slate-200 dark:border-slate-700 mb-0">
    ${buildLectureTabs(s)}
    <div class="lesson-body space-y-4">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">${l.heading}</h2>
      ${l.body || ''}
      ${l.code ? codeBlock(l.code, `${currentSection}-${currentLesson}-a`) : ''}
      ${l.code2 ? codeBlock(l.code2, `${currentSection}-${currentLesson}-b`) : ''}
      ${l.code3 ? codeBlock(l.code3, `${currentSection}-${currentLesson}-c`) : ''}
      ${l.callout ? `
        <div class="border-l-4 border-accent bg-red-50 dark:bg-red-900/10 p-4 rounded-r-xl my-6">
          <div class="font-mono text-xs text-accent dark:text-red-400 uppercase tracking-wider mb-2">${l.callout.title}</div>
          <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">${l.callout.text}</p>
        </div>` : ''}
      ${quizHtml}
    </div>
    <div class="flex justify-between items-center mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 gap-4">
      <button
        onclick="prevLesson()"
        ${isFirst ? 'disabled' : ''}
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
        ← Anterior
      </button>
      ${completeBtn}
      <button
        onclick="nextLesson()"
        ${isLast ? 'disabled' : ''}
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm bg-accent text-white hover:bg-accent-dark transition-all font-semibold disabled:opacity-30 disabled:cursor-not-allowed">
        Siguiente →
      </button>
    </div>
  `;
  content.scrollTop = 0;
}

// --- Actions ---
function answerQuiz(idx) {
  const key = `q-${currentSection}-${currentLesson}`;
  if (state[key] !== undefined) return;
  state[key] = idx;
  save();
  render();
}

function markDone() {
  state[getSectionKey(currentSection)] = { done: true };
  save();
  render();
}

function goToLesson(li) {
  currentLesson = li;
  render();
}

function nextLesson() {
  const s = SECTIONS[currentSection];
  if (currentLesson < s.lectures.length - 1) {
    currentLesson++;
  } else if (currentSection < SECTIONS.length - 1) {
    currentSection++;
    currentLesson = 0;
  }
  render();
}

function prevLesson() {
  if (currentLesson > 0) {
    currentLesson--;
  } else if (currentSection > 0) {
    currentSection--;
    currentLesson = SECTIONS[currentSection].lectures.length - 1;
  }
  render();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('-translate-x-full');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.add('-translate-x-full');
}

// Expose for onclick handlers in render templates
Object.assign(window, {
  toggleTheme, toggleSidebar, copyCode,
  answerQuiz, markDone, goToLesson, nextLesson, prevLesson,
});

window.addEventListener('resize', () => {
  document.getElementById('menu-toggle').classList.toggle('hidden', window.innerWidth >= 768);
});

// --- Bootstrap ---
async function loadSections() {
  try { state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch {}

  const content = document.getElementById('content');
  content.innerHTML = `<div class="flex items-center justify-center h-64 font-mono text-sm text-slate-400">Cargando secciones...</div>`;

  SECTIONS = await Promise.all(
    SECTION_SLUGS.map(slug =>
      import(`./sections/${slug}.js`).then(m => m.default)
    )
  );

  initTheme();
  render();
}

loadSections();
