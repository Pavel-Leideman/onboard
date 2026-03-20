/* ============================================================
   data-loader.js — OFFLINE verze (bez fetch)
   ============================================================ */

/* 🔧 Lokální šablona úkolů — skladba odpovídá tvému systému */
const TASK_TEMPLATE = [
  {
    id: "uvod-1",
    title: "Převzetí pracovních pomůcek",
    description: "Vyfoť převzaté pomůcky.",
    module: "Blok I",
    points: 5,
    evidenceRequired: true
  },
  {
    id: "uvod-2",
    title: "Seznámení s provozem",
    description: "Projděte si provoz se svým tutorem.",
    module: "Blok I",
    points: 5,
    evidenceRequired: false
  },
  {
    id: "provoz-1",
    title: "Bezpečnost práce",
    description: "Seznamte se s BOZP.",
    module: "Blok II",
    points: 10,
    evidenceRequired: false
  }
];

/* 🔧 Lokální shop položky */
const SHOP_ITEMS = [
  { id: "reward1", name: "Káva zdarma", price: 10, icon: "☕" },
  { id: "reward2", name: "Malá odměna", price: 15, icon: "🎁" }
];

/* ============================================================
   STORAGE API
============================================================ */
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

/* ============================================================
   Vytvoření instancí úkolů
============================================================ */
function createTaskInstances(templateTasks) {
  return templateTasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    module: t.module,
    points: t.points ?? 0,
    evidenceRequired: t.evidenceRequired ?? false,
    status: "New",
    photo: null,
    completedDate: null
  }));
}

/* ============================================================
   Inicializace uživatele (první spuštění)
============================================================ */
function initializeUser() {
  const isInitialized = loadFromLocalStorage("userInitialized");
  if (isInitialized) return;

  const taskInstances = createTaskInstances(TASK_TEMPLATE);

  saveToLocalStorage("userTasks", taskInstances);
  saveToLocalStorage("shopItems", SHOP_ITEMS);
  saveToLocalStorage("userCoins", 0);
  saveToLocalStorage("userNotes", "");
  saveToLocalStorage("userInitialized", true);

  console.log("✅ User initialized (offline mode)");
}

/* ============================================================
   Hlavní inicializace aplikace
============================================================ */
function loadAllData() {
  initializeUser();

  return {
    userTasks: loadFromLocalStorage("userTasks") ?? [],
    shopItems: loadFromLocalStorage("shopItems") ?? [],
    settings: {}
  };
}

/* ============================================================
   Autorun
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadAllData();
  console.log("✅ Application ready (offline loader)");
});

/* EXPORTY */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    saveToLocalStorage,
    loadFromLocalStorage,
    createTaskInstances,
    initializeUser,
    loadAllData
  };
}