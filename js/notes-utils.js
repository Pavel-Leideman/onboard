/* ============================================================
   notes-utils.js (FUNKČNÍ IMPLEMENTACE)
   Účel: správa uživatelských poznámek
   ============================================================ */

/**
 * Načte uživatelské poznámky
 * @returns {string} Poznámky nebo prázdný string
 */
function getUserNotes() {
  const notes = loadFromLocalStorage('userNotes');
  return notes || '';
}

/**
 * Uloží uživatelské poznámky
 * @param {string} notesText - Text poznámky
 */
function saveUserNotes(notesText) {
  saveToLocalStorage('userNotes', notesText);
}

/**
 * Inicializuje notes stránku
 */
function initNotesPage() {
  const notesTextarea = document.getElementById('notesTextarea');
  
  if (!notesTextarea) {
    console.warn('notesTextarea element not found');
    return;
  }
  
  // Načti uložené poznámky
  const savedNotes = getUserNotes();
  notesTextarea.value = savedNotes;
  
  // Přidej listener na tlačítko Uložit
  attachNotesSaveListener();
}

/**
 * Připojí event listener na tlačítko Uložit
 */
function attachNotesSaveListener() {
  const saveButton = document.getElementById('notesSaveButton');
  const notesTextarea = document.getElementById('notesTextarea');
  
  if (!saveButton || !notesTextarea) return;
  
  saveButton.addEventListener('click', () => {
    const notesText = notesTextarea.value;
    saveUserNotes(notesText);
    notifyNoteSaved();
  });
}

/**
 * Zobrazí oznámení, že byla poznámka uložena
 */
function notifyNoteSaved() {
  // Vytvoř dočasný element s oznámením
  const notification = createElement('div', 'notification notification-success', 'Poznámka byla uložena');
  
  document.body.appendChild(notification);
  
  // Odstraň oznámení po 3 sekundách
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Auto-init při načtení notes.html
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('notesTextarea')) {
    initNotesPage();
  }
});

// Exportuj funkce
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getUserNotes,
    saveUserNotes,
    initNotesPage,
    attachNotesSaveListener,
    notifyNoteSaved
  };
}