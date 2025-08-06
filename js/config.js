/**
 * config.js
 * * Berisi semua konfigurasi utama dan status awal permainan.
 * Ini memudahkan untuk mengubah parameter permainan di satu tempat.
 */

// --- KONFIGURASI ASET ---
// Ganti URL ini dengan path ke gambar Anda.
// Saya menggunakan placeholder agar bisa langsung dicoba.
// Format: https://placehold.co/{width}x{height}/{bgColor}/{textColor}?text={text}

export const CARD_BACK_IMAGE = 'CB.jpg';
export const WILD_CARD_IMAGE = 'wild.jpg';

// Konfigurasi kartu
export const SUITS = ['♥', '♦', '♣', '♠'];
export const VALUES = [
    { name: 'A', value: 1, image: 'as.jpg' },
    { name: '2', value: 2, image: 'satu.jpg' },
    { name: '3', value: 3, image: 'dua.jpg' },
    { name: '4', value: 4, image: 'tiga.jpg' },
    { name: '5', value: 5, image: 'empat.jpg' },
    { name: '6', value: 6, image: 'lima.jpg' },
    { name: '7', value: 7, image: 'enam.jpg' },
    { name: '8', value: 8, image: 'tujuh.jpg' },
    { name: '9', value: 9, image: 'delapan.jpg' },
    { name: '10', value: 10, image: 'sembilan.jpg' },
    { name: 'J', value: 11, image: 'jack.jpg' },
    { name: 'Q', value: 12, image: 'queen.jpg' },
    { name: 'K', value: 13, image: 'king.jpg' }
];
export const WILD_CARDS_COUNT = 2;

// Konfigurasi permainan
export const INITIAL_HP = 100;
export const MAX_CARDS_IN_HAND = 6;
export const CARDS_TO_DRAW = 3;
export const MAX_SELECTED_CARDS = 3;
export const TURN_DURATION = 30;

// Status awal permainan
export const initialGameState = {
    playerName: "",
    playerHP: INITIAL_HP,
    enemyHP: INITIAL_HP,
    playerHand: [],
    enemyHand: [],
    deck: [],
    graveyard: [],
    selectedCardIndices: [],
    turnPhase: 'player-select', // 'player-select', 'battle'
    gameOver: false,
    log: [],
    hasDrawnThisTurn: false,
    timer: TURN_DURATION,
    timerInterval: null
};

// Selektor Elemen DOM
export const elements = {
    startScreen: document.getElementById('start-screen'),
    mainGameWrapper: document.getElementById('main-game-wrapper'),
    gameScreen: document.getElementById('game-screen'),
    gameOverScreen: document.getElementById('game-over-screen'),
    
    playerNameInput: document.getElementById('player-name'),
    startBtn: document.getElementById('start-btn'),
    restartBtn: document.getElementById('restart-btn'),
    
    // Panel Info
    leftPanel: document.getElementById('left-panel'),
    rightPanel: document.getElementById('right-panel'),
    leftPanelToggle: document.getElementById('left-panel-toggle'),
    rightPanelToggle: document.getElementById('right-panel-toggle'),

    playerNameDisplay: document.getElementById('player-name-display'),
    playerHp: document.getElementById('player-hp'),
    playerHpBar: document.getElementById('player-hp-bar'),
    playerCardCount: document.getElementById('player-card-count'),
    
    enemyHp: document.getElementById('enemy-hp'),
    enemyHpBar: document.getElementById('enemy-hp-bar'),
    enemyCardCount: document.getElementById('enemy-card-count'),
    
    deckCount: document.getElementById('deck-count'),
    graveyardCount: document.getElementById('graveyard-count'),
    
    playerCardsContainer: document.getElementById('player-cards'),
    enemyCardsContainer: document.getElementById('enemy-cards'),
    playerBattleCards: document.getElementById('player-battle-cards'),
    enemyBattleCards: document.getElementById('enemy-battle-cards'),
    
    drawBtn: document.getElementById('draw-btn'),
    battleBtn: document.getElementById('battle-btn'),
    endTurnBtn: document.getElementById('end-turn-btn'),
    
    logContainer: document.getElementById('log-container'),
    resultMessage: document.getElementById('result-message'),
    
    turnIndicator: document.getElementById('turn-indicator'),
    timerDisplay: document.getElementById('timer'),
    timerFill: document.getElementById('timer-fill'),
};
