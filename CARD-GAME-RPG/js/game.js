/**
 * game.js
 * * Modul ini berisi semua logika inti permainan.
 * Mengelola status permainan, giliran, serangan, dan AI musuh.
 */

import { SUITS, VALUES, WILD_CARDS_COUNT, MAX_CARDS_IN_HAND, MAX_SELECTED_CARDS, CARDS_TO_DRAW, TURN_DURATION, initialGameState, WILD_CARD_IMAGE } from './config.js';
import { updateUI, renderBattlefield, clearBattlefield, updateTimerUI, showScreen, showGameResult, triggerBattleAnimation } from './ui.js';

let gameState = JSON.parse(JSON.stringify(initialGameState));

/**
 * Menambahkan pesan ke log pertempuran.
 * @param {string} message - Pesan yang akan ditambahkan.
 * @param {string} type - 'player', 'enemy', atau 'system'.
 */
function addLog(message, type = 'system') {
    const logClass = type === 'player' ? 'player-turn' : (type === 'enemy' ? 'enemy-turn' : '');
    gameState.log.push(`<div class="log-entry ${logClass}">${message}</div>`);
    if (gameState.log.length > 10) {
        gameState.log.shift();
    }
}

// --- FUNGSI TIMER ---
function stopTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
}

function startTimer() {
    stopTimer();
    gameState.timer = TURN_DURATION;
    updateTimerUI(gameState.timer, TURN_DURATION);

    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        updateTimerUI(gameState.timer, TURN_DURATION);
        if (gameState.timer <= 0) {
            addLog("Waktu habis! Anda melewati giliran ini.", 'player');
            handleEndTurnClick(); // Otomatis lewati giliran jika waktu habis
        }
    }, 1000);
}


// --- FUNGSI DECK & KARTU ---
function createDeck() {
    gameState.deck = [];
    for (const suit of SUITS) {
        for (const card of VALUES) {
            gameState.deck.push({ suit, name: card.name, value: card.value, displayName: `${card.name}${suit}`, isWild: false, image: card.image });
        }
    }
    for (let i = 0; i < WILD_CARDS_COUNT; i++) {
        gameState.deck.push({ suit: '★', name: 'WILD', value: 0, displayName: 'WILD★', isWild: true, image: WILD_CARD_IMAGE });
    }
}

function shuffleDeck() {
    for (let i = gameState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
    }
}

function drawCards(hand, count) {
    for (let i = 0; i < count; i++) {
        if (hand.length < MAX_CARDS_IN_HAND) {
            if (gameState.deck.length === 0) {
                addLog("Deck telah habis! Mengocok ulang Graveyard.", "system");
                gameState.deck = [...gameState.graveyard];
                gameState.graveyard = [];
                shuffleDeck();
            }
            if (gameState.deck.length > 0) {
                hand.push(gameState.deck.pop());
            }
        }
    }
}

// --- FUNGSI AKSI PEMAIN ---
export function handleCardClick(index) {
    if (gameState.turnPhase !== 'player-select') return;

    const selectedIndex = gameState.selectedCardIndices.indexOf(index);
    if (selectedIndex > -1) {
        gameState.selectedCardIndices.splice(selectedIndex, 1);
    } else if (gameState.selectedCardIndices.length < MAX_SELECTED_CARDS) {
        gameState.selectedCardIndices.push(index);
    }
    updateUI(gameState);
}

export function handleDrawClick() {
    if (gameState.turnPhase === 'player-select' && !gameState.hasDrawnThisTurn) {
        drawCards(gameState.playerHand, CARDS_TO_DRAW);
        gameState.hasDrawnThisTurn = true;
        addLog(`${gameState.playerName} mengambil ${CARDS_TO_DRAW} kartu.`, 'player');
        updateUI(gameState);
    }
}

export function handleBattleClick() {
    if (gameState.turnPhase !== 'player-select' || gameState.selectedCardIndices.length === 0) return;
    stopTimer();
    gameState.turnPhase = 'battle';
    updateUI(gameState);
    
    // Proses kartu pemain
    const playerCards = [];
    let playerValue = 0;
    gameState.selectedCardIndices.sort((a, b) => b - a).forEach(index => {
        const card = gameState.playerHand.splice(index, 1)[0];
        playerCards.push(card);
        let cardValue = card.value;
        if (card.isWild) {
            const bonus = Math.floor(Math.random() * 10) + 1;
            cardValue += bonus;
            addLog(`${gameState.playerName} menggunakan WILD & mendapat +${bonus} poin!`, 'player');
        }
        playerValue += cardValue;
    });
    gameState.selectedCardIndices = [];
    addLog(`${gameState.playerName} menyerang dengan nilai total ${playerValue}.`, 'player');

    // Proses kartu musuh (AI)
    const enemyCards = [];
    let enemyValue = 0;
    const enemyCardCount = Math.min(gameState.enemyHand.length, Math.floor(Math.random() * 3) + 1);
    gameState.enemyHand.sort((a, b) => b.value - a.value); // AI cerdas sedikit
    for (let i = 0; i < enemyCardCount; i++) {
        const card = gameState.enemyHand.shift(); // Ambil kartu terkuat
        enemyCards.push(card);
        enemyValue += card.value;
    }
    addLog(`Musuh merespons dengan nilai total ${enemyValue}.`, 'enemy');

    // Pindahkan kartu ke graveyard
    gameState.graveyard.push(...playerCards, ...enemyCards);

    // Tampilkan di meja pertempuran
    renderBattlefield(playerCards, enemyCards);

    // Jalankan animasi dan selesaikan pertempuran
    setTimeout(() => {
        triggerBattleAnimation();
        resolveBattle(playerValue, enemyValue);
    }, 500);
}

export function handleEndTurnClick() {
    if (gameState.turnPhase !== 'player-select') return;
    stopTimer();
    addLog(`${gameState.playerName} melewati giliran dan mengambil 1 kartu.`, 'player');
    drawCards(gameState.playerHand, 1);
    startNewTurn();
}


// --- LOGIKA PERMAINAN INTI ---
function resolveBattle(playerValue, enemyValue) {
    setTimeout(() => {
        const diff = Math.abs(playerValue - enemyValue);
        if (playerValue > enemyValue) {
            gameState.enemyHP -= diff;
            addLog(`${gameState.playerName} menang! Musuh kehilangan <span class="damage">${diff} HP</span>.`, 'system');
        } else if (enemyValue > playerValue) {
            gameState.playerHP -= diff;
            addLog(`Musuh menang! ${gameState.playerName} kehilangan <span class="damage">${diff} HP</span>.`, 'system');
        } else {
            addLog("Pertempuran seri! Tidak ada yang terluka.", 'system');
        }

        if (checkGameOver()) return;

        startNewTurn();
    }, 1000); // Tunggu animasi selesai
}

function checkGameOver() {
    if (gameState.playerHP <= 0 || gameState.enemyHP <= 0) {
        gameState.gameOver = true;
        stopTimer();
        const playerWon = gameState.playerHP > 0;
        showGameResult(playerWon, gameState.playerName);
        showScreen('gameOver');
        return true;
    }
    return false;
}

function startNewTurn() {
    // Kosongkan meja pertempuran setelah jeda singkat
    setTimeout(() => {
        clearBattlefield();
        
        // Atur ulang status untuk giliran baru
        gameState.turnPhase = 'player-select';
        gameState.hasDrawnThisTurn = false;
        gameState.selectedCardIndices = [];

        // Musuh mengambil kartu jika perlu
        if (gameState.enemyHand.length < 3) {
            drawCards(gameState.enemyHand, CARDS_TO_DRAW);
        }

        updateUI(gameState);
        startTimer();
    }, 1500); // Jeda sebelum giliran baru dimulai
}

export function initGame(playerName) {
    gameState = JSON.parse(JSON.stringify(initialGameState));
    gameState.playerName = playerName;

    createDeck();
    shuffleDeck();

    drawCards(gameState.playerHand, 5);
    drawCards(gameState.enemyHand, 5);

    addLog(`Permainan dimulai! ${playerName} vs Musuh.`);
    
    showScreen('game');
    startNewTurn();
}
