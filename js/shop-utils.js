/* ============================================================
   shop-utils.js (FUNKČNÍ IMPLEMENTACE)
   Účel: práce s nákupem odměn v obchodě
   ============================================================ */

/**
 * Načte shop items z LocalStorage
 * @returns {array} Pole shop položek
 */
function loadShopItems() {
  const items = loadFromLocalStorage('shopItems');
  return Array.isArray(items) ? items : [];
}

/**
 * Zkontroluje, zda je nákup možný
 * @param {number} itemPrice - Cena položky
 * @param {number} userCoins - Mince uživatele
 * @returns {boolean} Lze koupit?
 */
function canPurchaseItem(itemPrice, userCoins) {
  return userCoins >= itemPrice;
}

/**
 * Odečte mince z uživatelova zůstatku
 * @param {number} amount - Počet mincí k odečtení
 * @returns {boolean} Úspěch?
 */
function deductCoins(amount) {
  const currentCoins = calculateCoins();
  
  if (currentCoins < amount) {
    return false;
  }
  
  // Najdi Approved/Completed úkoly a ubrat body
  const tasks = getAllTasks();
  let remaining = amount;
  
  for (let i = tasks.length - 1; i >= 0 && remaining > 0; i--) {
    if ((tasks[i].status === 'Approved' || tasks[i].status === 'Completed') && tasks[i].points > 0) {
      const deduct = Math.min(remaining, tasks[i].points);
      tasks[i].points -= deduct;
      remaining -= deduct;
    }
  }
  
  saveAllTasks(tasks);
  return true;
}

/**
 * Hlavní nákupní logika
 * @param {string} itemId - ID položky
 * @returns {object} { success, newCoinBalance, message }
 */
function purchaseItem(itemId) {
  const shopItems = loadShopItems();
  const item = shopItems.find(i => i.id === itemId);
  
  if (!item) {
    return { success: false, message: 'Položka nenalezena' };
  }
  
  const currentCoins = calculateCoins();
  
  if (!canPurchaseItem(item.price, currentCoins)) {
    return {
      success: false,
      newCoinBalance: currentCoins,
      message: `Nedostatek zlata v truhlici! Potřebujete ${item.price}, máte ${currentCoins}`
    };
  }
  
  // Odečti mince
  if (deductCoins(item.price)) {
    const newBalance = calculateCoins();
    return {
      success: true,
      newCoinBalance: newBalance,
      message: `${item.name} zakoupeno! Zbývající mince: ${newBalance}`
    };
  }
  
  return {
    success: false,
    newCoinBalance: currentCoins,
    message: 'Nákup se nezdařil'
  };
}

/**
 * Vykreslí seznam shop položek
 * @param {array} itemsArray - Pole shop položek
 */
function renderShopList(itemsArray) {
  const shopList = document.getElementById('shopList');
  
  if (!shopList) return;
  
  shopList.innerHTML = '';
  
  itemsArray.forEach(item => {
    const itemElement = createElement('div', 'shop-item');
    
    const iconEl = createElement('span', 'shop-icon', item.icon || '🎁');
    const nameEl = createElement('h3', 'shop-name', item.name);
    const priceEl = createElement('p', 'shop-price', `${item.price} mincí`);
    const buyButton = createElement('button', 'shop-buy-btn', 'Koupit');
    
    buyButton.addEventListener('click', () => {
      const result = purchaseItem(item.id);
      alert(result.message);
      if (result.success) {
        updateShopCoinsDisplay();
        renderShopList(itemsArray); // Refresh UI
      }
    });
    
    itemElement.appendChild(iconEl);
    itemElement.appendChild(nameEl);
    itemElement.appendChild(priceEl);
    itemElement.appendChild(buyButton);
    
    shopList.appendChild(itemElement);
  });
}

/**
 * Aktualizuje zobrazení mincí v shopu
 */
function updateShopCoinsDisplay() {
  const coins = calculateCoins();
  const coinsLabelShop = document.getElementById('coinsLabelShop');
  
  if (coinsLabelShop) {
    coinsLabelShop.textContent = coins;
  }
}

/**
 * Inicializuje shop stránku
 */
function initShopPage() {
  const shopItems = loadShopItems();
  
  renderShopList(shopItems);
  updateShopCoinsDisplay();
  
  console.log('Shop page initialized');
}

// Auto-init při načtení shop.html
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('shopList')) {
    initShopPage();
  }
});

// Exportuj funkce
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadShopItems,
    canPurchaseItem,
    purchaseItem,
    deductCoins,
    renderShopList,
    updateShopCoinsDisplay,
    initShopPage
  };
}