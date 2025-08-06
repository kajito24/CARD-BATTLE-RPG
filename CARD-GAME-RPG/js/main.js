/**
 * main.js
 * * Ini adalah titik masuk (entry point) dari aplikasi.
 * Tugasnya adalah mengimpor modul lain dan mengatur event listener
 * untuk interaksi pengguna.
 */
import { setupPanelToggles } from './ui.js';
import { elements } from './config.js';
import { initGame, handleDrawClick, handleBattleClick, handleEndTurnClick } from './game.js';
import { showScreen } from './ui.js';


/**
 * Menangani klik tombol "Mulai Permainan".
 */
function handleStartClick() {
    const playerName = elements.playerNameInput.value.trim();
    if (playerName) {
        initGame(playerName);
    } else {
        // Ganti alert dengan metode notifikasi yang lebih baik jika ada
        alert("Harap masukkan nama Anda terlebih dahulu!");
    }
}

/**
 * Menangani klik tombol "Main Lagi".
 */
function handleRestartClick() {
    elements.playerNameInput.value = ''; // Kosongkan input
    showScreen('start');
}

/**
 * Fungsi utama untuk menginisialisasi semua event listener.
 */
function initialize() {
    elements.startBtn.addEventListener('click', handleStartClick);
    elements.restartBtn.addEventListener('click', handleRestartClick);
    
    elements.drawBtn.addEventListener('click', handleDrawClick);
    elements.battleBtn.addEventListener('click', handleBattleClick);
    elements.endTurnBtn.addEventListener('click', handleEndTurnClick);
    
    // Tampilkan layar awal saat halaman dimuat
    showScreen('start');
    setupPanelToggles();
}

// Jalankan inisialisasi setelah semua konten halaman dimuat.
document.addEventListener('DOMContentLoaded', initialize);
document.addEventListener('DOMContentLoaded', initialize);