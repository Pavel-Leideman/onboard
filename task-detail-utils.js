/* ============================================================
   task-detail-utils.js (FUNKČNÍ IMPLEMENTACE)
   Účel: logika pro stránku task-detail.html
     • načtení úkolu podle ID z URL
     • zobrazení dat v UI
     • upload obrázku (Base64)
     • splnění úkolu (Completed)
     • schválení / zamítnutí tutorem
     • přepínání zobrazení dle role
   ============================================================ */

/**
 * Dočasné úložiště pro nově nahranou fotku
 */
let uploadedImageBase64 = null;

/**
 * Přečte taskId z query parametru
 * @returns {string|null} ID úkolu nebo null
 */
function getTaskIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('taskId');
}

/**
 * Zkontroluje, zda je režim "tutor"
 * @returns {boolean} true pokud je tutor=yes v URL
 */
function isTutorMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('tutor') === 'yes';
}

/**
 * Načte a zobrazí detail úkolu
 * @param {string} taskId - ID úkolu
 */
function loadTaskDetail(taskId) {
  const task = getTaskById(taskId);
  
  if (!task) {
    const container = document.getElementById('taskDetailContainer');
    if (container) {
      container.innerHTML = '<p style="color: red;">Úkol nebyl nalezen</p>';
    }
    return false;
  }
  
  // Vyplň UI elementy
  const elements = {
    taskTitle: task.title,
    taskModule: `Modul: ${task.module}`,
    taskStatus: formatStatus(task),
    taskDescription: task.description || 'Bez popisu'
  };
  
  Object.entries(elements).forEach(([elementId, value]) => {
    const el = document.getElementById(elementId);
    if (el) el.textContent = value;
  });
  
  // Zobraz/skryj evidence info
  const evidenceInfo = document.getElementById('evidenceInfo');
  if (evidenceInfo) {
    if (hasEvidenceRequired(task)) {
      evidenceInfo.style.display = 'block';
      evidenceInfo.innerHTML = '📸 Tento úkol vyžaduje fotografii jako důkaz';
    } else {
      evidenceInfo.style.display = 'none';
    }
  }
  
  // Zobraz fotku, pokud existuje
  if (task.photo) {
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview) {
      photoPreview.src = task.photo;
      photoPreview.style.display = 'block';
    }
  }
  
  return true;
}

/**
 * Nastaví handler pro upload fotky
 */
function setupUploadHandler() {
  const photoInput = document.getElementById('photoInput');
  const photoPreview = document.getElementById('photoPreview');
  
  if (!photoInput) return;
  
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Zkontroluj typ souboru
    if (!file.type.startsWith('image/')) {
      alert('Prosím vyberte obrázek');
      return;
    }
    
    // Převeď na Base64
    const reader = new FileReader();
    
    reader.onload = (event) => {
      uploadedImageBase64 = event.target.result;
      
      // Zobraz náhled
      if (photoPreview) {
        photoPreview.src = uploadedImageBase64;
        photoPreview.style.display = 'block';
      }
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Splní úkol
 * @param {string} taskId - ID úkolu
 */
function completeTask(taskId) {
  const task = getTaskById(taskId);
  
  if (!task) {
    alert('Úkol nebyl nalezen');
    return;
  }
  
  // Zkontroluj, zda je požadována evidence
  if (hasEvidenceRequired(task) && !uploadedImageBase64) {
    alert('Tento úkol vyžaduje fotografii jako důkaz');
    return;
  }
  
  // Aktualizuj status
  updateTaskStatus(taskId, 'Completed');
  
  // Ulož fotku, pokud existuje
  if (uploadedImageBase64) {
    setTaskPhoto(taskId, uploadedImageBase64);
  }
  
  alert('Úkol byl označen jako hotov. Nyní čeká na schválení tutora.');
  
  // Přesměruj zpět na tasks.html
  window.location.href = 'tasks.html';
}

/**
 * Nastaví event listener na tlačítko "Splnit"
 * @param {string} taskId - ID úkolu
 */
function setupCompleteButton(taskId) {
  const btnComplete = document.getElementById('btnComplete');
  
  if (!btnComplete) return;
  
  btnComplete.addEventListener('click', () => {
    completeTask(taskId);
  });
}

/**
 * Nastaví tutor akce (Schválit / Zamítnout)
 * @param {string} taskId - ID úkolu
 */
function setupTutorActions(taskId) {
  const btnApprove = document.getElementById('btnApprove');
  const btnReject = document.getElementById('btnReject');
  
  if (btnApprove) {
    btnApprove.addEventListener('click', () => {
      const result = approveTask(taskId);
      alert(result.message);
      window.location.href = 'tutor.html';
    });
  }
  
  if (btnReject) {
    btnReject.addEventListener('click', () => {
      const result = rejectTask(taskId);
      alert(result.message);
      window.location.href = 'tutor.html';
    });
  }
}

/**
 * Přepíná UI prvky podle role (nováček vs. tutor)
 */
function toggleUIForRole() {
  const uploadSection = document.getElementById('uploadSection');
  const completeSection = document.getElementById('completeSection');
  const tutorActions = document.getElementById('tutorActions');
  
  const tutor = isTutorMode();
  
  if (tutor) {
    // Tutor režim
    if (uploadSection) uploadSection.style.display = 'none';
    if (completeSection) completeSection.style.display = 'none';
    if (tutorActions) tutorActions.style.display = 'block';
  } else {
    // Nováček režim
    if (uploadSection) uploadSection.style.display = 'block';
    if (completeSection) completeSection.style.display = 'block';
    if (tutorActions) tutorActions.style.display = 'none';
  }
}

/**
 * Inicializuje stránku task-detail
 */
function initTaskDetailPage() {
  const taskId = getTaskIdFromURL();
  
  if (!taskId) {
    alert('Chyba: ID úkolu nebylo specifikováno');
    window.location.href = 'tasks.html';
    return;
  }
  
  // Načti detail úkolu
  const taskLoaded = loadTaskDetail(taskId);
  
  if (!taskLoaded) {
    return;
  }
  
  // Přepni UI podle role
  toggleUIForRole();
  
  // Nastav handlery
  const tutor = isTutorMode();
  
  if (tutor) {
    setupTutorActions(taskId);
  } else {
    setupUploadHandler();
    setupCompleteButton(taskId);
  }
  
  console.log(`Task detail page initialized (tutor: ${tutor})`);
}

/**
 * Auto-init při načtení stránky
 */
document.addEventListener('DOMContentLoaded', () => {
  initTaskDetailPage();
});

/**
 * Exporty pro testování
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getTaskIdFromURL,
    isTutorMode,
    loadTaskDetail,
    setupUploadHandler,
    completeTask,
    setupCompleteButton,
    setupTutorActions,
    toggleUIForRole,
    initTaskDetailPage
  };
}