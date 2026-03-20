/* ============================================================
   dom-utils.js (FUNKČNÍ IMPLEMENTACE)
   Účel: generování HTML prvků a UI
   ============================================================ */

/**
 * Vytvoří DOM element s atributy
 * @param {string} tag - Značka HTML (div, button, atd.)
 * @param {string} className - CSS třída
 * @param {string} innerHTML - HTML obsah
 * @returns {HTMLElement} Vytvořený element
 */
function createElement(tag, className = '', innerHTML = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
}

/**
 * Vykreslí jednu task card
 * @param {object} task - Úkol
 * @returns {HTMLElement} Task card element
 */
function renderTaskCard(task) {
  const card = createElement('div', 'task-card');
  
  const titleEl = createElement('h3', 'task-title', task.title);
  const moduleEl = createElement('p', 'task-module', `Modul: ${task.module}`);
  const statusEl = createElement('p', 'task-status', formatStatus(task));
  const evidenceIcon = createElement('span', 'evidence-icon', getEvidenceIcon(task));
  
  card.appendChild(titleEl);
  card.appendChild(moduleEl);
  card.appendChild(statusEl);
  card.appendChild(evidenceIcon);
  
  // Nastaví onclick
  if (isTaskClickable(task)) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => navigateToTaskDetail(task.id));
  }
  
  return card;
}

/**
 * Vykreslí seznam úkolů
 * @param {array} taskArray - Pole úkolů
 */
function renderTaskList(taskArray) {
  const taskList = document.getElementById('taskList');
  if (!taskList) return;
  
  taskList.innerHTML = '<p>Žádné úkoly k dispozici</p>';

  
  if (!Array.isArray(taskArray) || taskArray.length === 0) {
    taskList.innerHTML = '<p>Žádné úkoly k dispozici</p>';
    return;
  }
  
  taskArray.forEach(task => {
    const card = renderTaskCard(task);
    taskList.appendChild(card);
  });
}

/**
 * Aktualizuje progress bar
 */
function updateProgressBar() {
  updateProgressUI();
}

/**
 * Aktualizuje zobrazení mincí
 */
function updateCoinsDisplay() {
  const coins = calculateCoins();
  const coinsLabel = document.getElementById('coinsLabel');
  
  if (coinsLabel) {
    coinsLabel.textContent = coins;
  }
}

/**
 * Přidá event listener na filtr bloků
 */
function attachBlockFilterListener() {
  const blockFilter = document.getElementById('blockFilter');
  
  if (!blockFilter) return;
  
  blockFilter.addEventListener('change', (e) => {
    const selectedBlock = e.target.value;
    const tasks = getTasksByBlock(selectedBlock);
    
    renderTaskList(tasks);
    updateProgressBar();
    updateCoinsDisplay();
  });
}

/**
 * Inicializuje tasks stránku
 */
function initTasksPage() {
  const tasks = getAllTasks();
  
  renderTaskList(tasks);
  attachBlockFilterListener();
  updateProgressBar();
  updateCoinsDisplay();
  
  console.log('Tasks page initialized');
}

/**
 * Přesměruje na task detail
 * @param {string} taskId - ID úkolu
 */
function navigateToTaskDetail(taskId) {
  window.location.href = `task-detail.html?taskId=${taskId}`;
}

// Auto-init při načtení tasks.html
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('taskList')) {
    initTasksPage();
  }
});

// Exportuj funkce
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createElement,
    renderTaskCard,
    renderTaskList,
    updateProgressBar,
    updateCoinsDisplay,
    attachBlockFilterListener,
    initTasksPage,
    navigateToTaskDetail
  };
}