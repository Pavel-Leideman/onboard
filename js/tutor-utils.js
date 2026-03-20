/* ============================================================
   tutor-utils.js (FUNKČNÍ IMPLEMENTACE)
   Účel: logika pro tutora - schválení/zamítnutí úkolů
   ============================================================ */

/**
 * Vrací úkoly čekající na schválení
 * @returns {array} Pole úkolů se status "Completed"
 */
function getTasksWaitingForApproval() {
  const tasks = getAllTasks();
  return tasks.filter(task => task.status === 'Completed');
}

/**
 * Schválí úkol
 * @param {string} taskId - ID úkolu
 * @returns {object} { success, message }
 */
function approveTask(taskId) {
  updateTaskStatus(taskId, 'Approved');
  return {
    success: true,
    message: 'Úkol byl schválený'
  };
}

/**
 * Zamítne úkol
 * @param {string} taskId - ID úkolu
 * @returns {object} { success, message }
 */
function rejectTask(taskId) {
  updateTaskStatus(taskId, 'Rejected');
  return {
    success: true,
    message: 'Úkol byl zamítnut'
  };
}

/**
 * Přesměruje na detail úkolu v tutor módu
 * @param {string} taskId - ID úkolu
 */
function navigateToTutorTaskDetail(taskId) {
  window.location.href = `task-detail.html?tutor=yes&taskId=${taskId}`;
}

/**
 * Vykreslí seznam úkolů čekajících na schválení
 * @param {array} taskArray - Pole úkolů
 */
function renderTutorTaskList(taskArray) {
  const tutorList = document.getElementById('tutorTaskList');
  
  if (!tutorList) return;
  
  tutorList.innerHTML = '';
  
  taskArray.forEach(task => {
    const itemElement = createElement('div', 'tutor-task-item');
    
    const titleEl = createElement('h3', 'tutor-task-title', task.title);
    const moduleEl = createElement('p', 'tutor-task-module', `Modul: ${task.module}`);
    
    const photoEl = task.photo
      ? createElement('img', 'tutor-task-photo', '')
      : null;
    
    if (photoEl) photoEl.src = task.photo;
    
    const approveBtn = createElement('button', 'tutor-approve-btn', 'Schválit');
    const rejectBtn = createElement('button', 'tutor-reject-btn', 'Zamítnout');
    
    approveBtn.addEventListener('click', () => {
      const result = approveTask(task.id);
      alert(result.message);
      renderTutorTaskList(getTasksWaitingForApproval());
      updateTutorStatsUI();
    });
    
    rejectBtn.addEventListener('click', () => {
      const result = rejectTask(task.id);
      alert(result.message);
      renderTutorTaskList(getTasksWaitingForApproval());
      updateTutorStatsUI();
    });
    
    itemElement.appendChild(titleEl);
    itemElement.appendChild(moduleEl);
    if (photoEl) itemElement.appendChild(photoEl);
    itemElement.appendChild(approveBtn);
    itemElement.appendChild(rejectBtn);
    
    tutorList.appendChild(itemElement);
  });
}

/**
 * Přidá event listenery pro tutor akce
 */
function attachTutorActions() {
  // Akce se připojují přímo v renderTutorTaskList()
  console.log('Tutor actions attached');
}

/**
 * Vrací statistiky pro tutora
 * @returns {object} Statistiky
 */
function getTutorStats() {
  const tasks = getAllTasks();
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const approved = tasks.filter(t => t.status === 'Approved').length;
  const rejected = tasks.filter(t => t.status === 'Rejected').length;
  const total = tasks.length;
  
  const percentApproved = total > 0 ? Math.round((approved / total) * 100) : 0;
  
  return {
    totalTasks: total,
    waitingForApproval: completed,
    approved,
    rejected,
    percentApproved
  };
}

/**
 * Aktualizuje tutor statistiky na UI
 */
function updateTutorStatsUI() {
  const stats = getTutorStats();
  
  const elements = {
    tutorStatsApproved: stats.approved,
    tutorStatsRejected: stats.rejected,
    tutorStatsWaiting: stats.waitingForApproval,
    tutorStatsPercent: `${stats.percentApproved}%`
  };
  
  Object.entries(elements).forEach(([elementId, value]) => {
    const el = document.getElementById(elementId);
    if (el) el.textContent = value;
  });
}

/**
 * Inicializuje tutor stránku
 */
function initTutorPage() {
  const tasksWaiting = getTasksWaitingForApproval();
  
  renderTutorTaskList(tasksWaiting);
  attachTutorActions();
  updateTutorStatsUI();
  
  console.log('Tutor page initialized');
}

// Auto-init při načtení tutor.html
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('tutorTaskList')) {
    initTutorPage();
  }
});

// Exportuj funkce
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getTasksWaitingForApproval,
    approveTask,
    rejectTask,
    navigateToTutorTaskDetail,
    renderTutorTaskList,
    attachTutorActions,
    getTutorStats,
    updateTutorStatsUI,
    initTutorPage
  };
}