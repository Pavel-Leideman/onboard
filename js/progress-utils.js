/* ============================================================
   progress-utils.js (FUNKČNÍ IMPLEMENTACE)
   Účel: výpočet procenta splnění a statistiky
   ============================================================ */

/**
 * Vrací všechna data o pokroku
 * @returns {object} Objekt s počty a procenty
 */
function getProgressData() {
  const tasks = getAllTasks();
  
  const totalTasks = tasks.length;
  const approvedTasks = tasks.filter(t => t.status === 'Approved').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const rejectedTasks = tasks.filter(t => t.status === 'Rejected').length;
  const newTasks = tasks.filter(t => t.status === 'New').length;
  
  return {
    total: totalTasks,
    approved: approvedTasks,
    completed: completedTasks,
    rejected: rejectedTasks,
    new: newTasks,
    percentApproved: calculatePercent(approvedTasks, totalTasks),
    percentCompleted: calculatePercent(completedTasks, totalTasks)
  };
}

/**
 * Pomocná funkce: spočítá procento
 * @param {number} part - Část
 * @param {number} total - Celek
 * @returns {number} Procento
 */
function calculatePercent(part, total) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

/**
 * Aktualizuje progress bar na UI
 */
function updateProgressUI() {
  const data = getProgressData();
  
  const progressPercent = document.getElementById('progressPercent');
  const progressValue = document.getElementById('progressValue');
  
  if (progressPercent) {
    progressPercent.textContent = `${data.percentApproved} %`;
  }
  
  if (progressValue) {
    progressValue.style.width = `${data.percentApproved}%`;
  }
}

/**
 * Vrací textový popis pokroku
 * @returns {string} Popis pokroku
 */
function getOverallCompletionLabel() {
  const data = getProgressData();
  
  if (data.approved === data.total && data.total > 0) {
    return 'Hotovo';
  }
  
  if (data.completed > 0 || data.approved > 0) {
    return 'Čeká na schválení';
  }
  
  return 'Start';
}

/**
 * Vrací statistiky pro tutor stránku
 * @returns {object} Statistiky
 */
function getStatsForTutor() {
  const data = getProgressData();
  
  return {
    completed: data.completed,
    approved: data.approved,
    rejected: data.rejected,
    percentApproved: data.percentApproved
  };
}

/**
 * Vrací statistiky pro admin stránku
 * @returns {object} Statistiky pro admin
 */
function getStatsForAdmin() {
  const data = getProgressData();
  const tasks = getAllTasks();
  
  const tasksWithPhoto = tasks.filter(t => t.photo !== null).length;
  const tasksWithoutPhoto = tasks.filter(t => t.photo === null).length;
  
  return {
    ...data,
    tasksWithPhoto,
    tasksWithoutPhoto,
    averageProgress: data.percentApproved
  };
}

// Exportuj funkce
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getProgressData,
    calculatePercent,
    updateProgressUI,
    getOverallCompletionLabel,
    getStatsForTutor,
    getStatsForAdmin
  };
}