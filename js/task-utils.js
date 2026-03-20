/* ============================================================
   task-utils.js (FUNKČNÍ IMPLEMENTACE)
   Účel: práce s instancemi úkolů, filtrování, helpery
   ============================================================ */

/**
 * Načte všechny úkoly z LocalStorage
 * @returns {array} Pole úkolů
 */
function getAllTasks() {
  const tasks = loadFromLocalStorage('userTasks');
  return Array.isArray(tasks) ? tasks : [];
}

/**
 * Uloží všechny úkoly do LocalStorage
 * @param {array} tasks - Pole úkolů
 */
function saveAllTasks(tasks) {
  saveToLocalStorage('userTasks', tasks);
}

/**
 * Filtruje úkoly podle bloku
 * @param {string} blockName - Název bloku (např. "Blok I", "Blok II", "Vše")
 * @returns {array} Filtrovaná pole úkolů
 */
function getTasksByBlock(blockName) {
  const allTasks = getAllTasks();
  
  if (blockName === 'Vše' || blockName === 'All') {
    return allTasks;
  }
  
  return allTasks.filter(task => task.module === blockName);
}

/**
 * Najde konkrétní úkol podle ID
 * @param {string} taskId - ID úkolu
 * @returns {object|null} Úkol nebo null
 */
function getTaskById(taskId) {
  const tasks = getAllTasks();
  return tasks.find(task => task.id === taskId) || null;
}

/**
 * Změní status úkolu
 * @param {string} taskId - ID úkolu
 * @param {string} newStatus - Nový status (New, Completed, Approved, Rejected)
 */
function updateTaskStatus(taskId, newStatus) {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex !== -1) {
    tasks[taskIndex].status = newStatus;
    if (newStatus === 'Completed') {
      tasks[taskIndex].completedDate = new Date().toISOString();
    }
    saveAllTasks(tasks);
  }
}

/**
 * Uloží fotku (Base64) k úkolu
 * @param {string} taskId - ID úkolu
 * @param {string} base64Image - Base64 řetězec obrázku
 */
function setTaskPhoto(taskId, base64Image) {
  const tasks = getAllTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (task) {
    task.photo = base64Image;
    saveAllTasks(tasks);
  }
}

/**
 * Spočítá procento splnění úkolů
 * @returns {object} { percent, approved, total }
 */
function calculateProgress() {
  const tasks = getAllTasks();
  const approvedCount = tasks.filter(t => t.status === 'Approved').length;
  const total = tasks.length;
  
  const percent = total > 0 ? Math.round((approvedCount / total) * 100) : 0;
  
  return {
    percent,
    approved: approvedCount,
    total
  };
}

/**
 * Sečte body z Completed a Approved úkolů
 * @returns {number} Celkový počet mincí
 */
function calculateCoins() {
  const tasks = getAllTasks();
  return tasks
    .filter(t => t.status === 'Completed' || t.status === 'Approved')
    .reduce((sum, t) => sum + (t.points || 0), 0);
}

/**
 * Zkontroluje, zda úkol vyžaduje evidenci
 * @param {object} task - Úkol
 * @returns {boolean} true pokud vyžaduje evidenci
 */
function hasEvidenceRequired(task) {
  return task && task.evidenceRequired === true;
}

/**
 * Zkontroluje, zda je úkol kliknutelný
 * @param {object} task - Úkol
 * @returns {boolean} true pokud je kliknutelný
 */
function isTaskClickable(task) {
  return task && task.status !== 'Approved' && task.status !== 'Rejected';
}

/**
 * Vrátí textový popis stavu úkolu
 * @param {object} task - Úkol
 * @returns {string} Textový popis stavu
 */
function formatStatus(task) {
  const statusMap = {
    'New': 'Nový',
    'Completed': 'Hotovo – čeká na schválení',
    'Approved': 'Schváleno',
    'Rejected': 'Zamítnuto'
  };
  
  return statusMap[task.status] || task.status;
}

/**
 * Vrátí ikonku evidence
 * @param {object} task - Úkol
 * @returns {string} Ikona nebo prázdný string
 */
function getEvidenceIcon(task) {
  return hasEvidenceRequired(task) ? '📸' : '';
}

// Exportuj funkce
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAllTasks,
    saveAllTasks,
    getTasksByBlock,
    getTaskById,
    updateTaskStatus,
    setTaskPhoto,
    calculateProgress,
    calculateCoins,
    hasEvidenceRequired,
    isTaskClickable,
    formatStatus,
    getEvidenceIcon
  };
}