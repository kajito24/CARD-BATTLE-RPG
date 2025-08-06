/**
 * ui.js
 * * Modul ini bertanggung jawab untuk semua manipulasi DOM.
 * Fungsinya adalah mengambil state permainan dan me-render-nya ke layar.
 */

import { elements, CARD_BACK_IMAGE } from './config.js';
import { handleCardClick } from './game.js';

// --- FUNGSI UNTUK TOGGLE PANEL SELULER ---
/**
 * Menambahkan event listener ke tombol toggle panel.
 */
export function setupPanelToggles() {
    elements.leftPanelToggle.addEventListener('click', () => {
        elements.leftPanel.classList.toggle('show');
    });

    elements.rightPanelToggle.addEventListener('click', () => {
        elements.rightPanel.classList.toggle('show');
    });

    // Menutup panel jika mengklik di luar panel
    document.addEventListener('click', (event) => {
        if (!elements.leftPanel.contains(event.target) && !elements.leftPanelToggle.contains(event.target)) {
            elements.leftPanel.classList.remove('show');
        }
        if (!elements.rightPanel.contains(event.target) && !elements.rightPanelToggle.contains(event.target)) {
            elements.rightPanel.classList.remove('show');
        }
    });
}


/**
 * Membuat elemen HTML untuk sebuah kartu dengan gambar latar.
 * @param {object} card - Objek kartu.
 * @param {number} index - Indeks kartu di tangan pemain.
 * @returns {HTMLElement} Elemen div kartu.
 */
function createCardElement(card, index) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.index = index;
    cardEl.style.backgroundImage = `url('${card.image}')`;
    cardEl.innerHTML = `
        <div class="card-info-overlay">
            <span class="card-value-text">${card.name}</span>
            <span class="card-suit-text">${card.suit}</span>
        </div>
    `;
    cardEl.addEventListener('click', () => handleCardClick(index));
    return cardEl;
}

/**
 * Membuat elemen kartu untuk area pertempuran.
 * @param {object} card - Objek kartu.
 * @param {string} owner - 'player' atau 'enemy'.
 * @returns {HTMLElement} Elemen div kartu pertempuran.
 */
function createBattleCardElement(card, owner) {
    const cardEl = document.createElement('div');
    cardEl.className = `battle-card ${owner}`;
    cardEl.style.backgroundImage = `url('${card.image}')`;
    cardEl.innerHTML = `<div class="card-info-overlay">${card.name}${card.suit}</div>`;
    return cardEl;
}

/**
 * Merender kartu di tangan pemain.
 * @param {Array<object>} playerHand - Array kartu di tangan pemain.
 * @param {Array<number>} selectedCardIndices - Array indeks kartu yang dipilih.
 */
function renderPlayerCards(playerHand, selectedCardIndices) {
    elements.playerCardsContainer.innerHTML = '';
    playerHand.forEach((card, index) => {
        const cardEl = createCardElement(card, index);
        if (selectedCardIndices.includes(index)) {
            cardEl.classList.add('selected');
        }
        elements.playerCardsContainer.appendChild(cardEl);
    });
}

/**
 * Merender kartu musuh (tertutup).
 * @param {Array<object>} enemyHand - Array kartu di tangan musuh.
 */
function renderEnemyCards(enemyHand) {
    elements.enemyCardsContainer.innerHTML = '';
    enemyHand.forEach(() => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card back';
        cardEl.style.backgroundImage = `url('${CARD_BACK_IMAGE}')`;
        elements.enemyCardsContainer.appendChild(cardEl);
    });
}

/**
 * Menampilkan kartu yang dimainkan di area pertempuran.
 * @param {Array<object>} playerCards - Kartu yang dimainkan pemain.
 * @param {Array<object>} enemyCards - Kartu yang dimainkan musuh.
 */
export function renderBattlefield(playerCards, enemyCards) {
    elements.playerBattleCards.innerHTML = '';
    elements.enemyBattleCards.innerHTML = '';

    playerCards.forEach(card => {
        elements.playerBattleCards.appendChild(createBattleCardElement(card, 'player'));
    });

    enemyCards.forEach(card => {
        elements.enemyBattleCards.appendChild(createBattleCardElement(card, 'enemy'));
    });
}

/**
 * Memicu animasi pertarungan pada kartu di meja.
 */
export function triggerBattleAnimation() {
    const battleCards = document.querySelectorAll('.battle-card');
    battleCards.forEach(card => {
        card.classList.add('fighting');
        card.addEventListener('animationend', () => {
            card.classList.remove('fighting');
        }, { once: true });
    });
}

/**
 * Mengosongkan area pertempuran.
 */
export function clearBattlefield() {
    elements.playerBattleCards.innerHTML = '';
    elements.enemyBattleCards.innerHTML = '';
}

/**
 * Menambahkan entri baru ke log pertempuran.
 * @param {Array<string>} log - Array pesan log.
 */
function renderLog(log) {
    elements.logContainer.innerHTML = log.join('');
    elements.logContainer.scrollTop = elements.logContainer.scrollHeight;
}

/**
 * Memperbarui tampilan timer.
 * @param {number} currentTime - Waktu saat ini.
 * @param {number} totalTime - Durasi total giliran.
 */
export function updateTimerUI(currentTime, totalTime) {
    elements.timerDisplay.textContent = `${currentTime}s`;
    elements.timerFill.style.width = `${(currentTime / totalTime) * 100}%`;
}

/**
 * Memperbarui semua elemen UI berdasarkan state permainan saat ini.
 * @param {object} state - Objek gameState.
 */
export function updateUI(state) {
    // Info Pemain & Musuh
    elements.playerNameDisplay.textContent = state.playerName;
    elements.playerHp.textContent = Math.max(0, state.playerHP);
    elements.playerHpBar.style.width = `${(state.playerHP / 100) * 100}%`;
    elements.playerCardCount.textContent = `${state.playerHand.length}/${6}`;
    elements.enemyHp.textContent = Math.max(0, state.enemyHP);
    elements.enemyHpBar.style.width = `${(state.enemyHP / 100) * 100}%`;
    elements.enemyCardCount.textContent = `${state.enemyHand.length}/${6}`;

    // Deck & Graveyard
    elements.deckCount.textContent = state.deck.length;
    elements.graveyardCount.textContent = state.graveyard.length;

    // Kartu
    renderPlayerCards(state.playerHand, state.selectedCardIndices);
    renderEnemyCards(state.enemyHand);

    // Log
    renderLog(state.log);

    // Tombol
    const isPlayerActionable = state.turnPhase === 'player-select';
    elements.drawBtn.disabled = !isPlayerActionable || state.playerHand.length >= 6 || state.hasDrawnThisTurn;
    elements.battleBtn.disabled = !isPlayerActionable || state.selectedCardIndices.length === 0;
    elements.endTurnBtn.disabled = !isPlayerActionable;

    // Indikator Giliran
    if (state.turnPhase === 'player-select') {
        elements.turnIndicator.textContent = "PILIH KARTU";
        elements.turnIndicator.classList.remove('enemy-turn');
    } else {
        elements.turnIndicator.textContent = "BERTARUNG!";
        elements.turnIndicator.classList.add('enemy-turn');
    }
}

/**
 * Menampilkan layar yang ditentukan.
 * @param {string} screenName - 'start', 'game', atau 'gameOver'.
 */
export function showScreen(screenName) {
    elements.startScreen.style.display = 'none';
    elements.mainGameWrapper.style.display = 'none';
    elements.gameOverScreen.style.display = 'none';

    if (screenName === 'start') {
        elements.startScreen.style.display = 'block';
    } else if (screenName === 'game') {
        elements.mainGameWrapper.style.display = 'flex';
    } else if (screenName === 'gameOver') {
        elements.gameOverScreen.style.display = 'block';
    }
}

/**
 * Menampilkan pesan hasil permainan.
 * @param {boolean} playerWon - True jika pemain menang.
 * @param {string} playerName - Nama pemain.
 */
export function showGameResult(playerWon, playerName) {
    const message = playerWon
        ? `<span class="win">${playerName} MENANG!</span>`
        : `<span class="loss">MUSUH MENANG! Coba lagi!</span>`;
    elements.resultMessage.innerHTML = message;
}
