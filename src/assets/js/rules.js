// Globale variabelen declareren (References / Sequencing)
// Veranderd van 'const' naar 'let' omdat ze later pas geïnitialiseerd worden.
let rulesPopup;
let openBtn;
let closeBtn;
let scoringBtn;

// Hoofdfunctie om de UI te initialiseren (Functions)
function initUI() {
    // Domelementen ophalen
    rulesPopup = document.querySelector('#settings-popup');
    openBtn = document.querySelector('#open-settings-btn');
    closeBtn = document.querySelector('#close-settings-btn');
    scoringBtn = document.querySelector('#open-scoring-btn');

    checkUrlParams();
    setupEventListeners();
}

function checkUrlParams() {
    // 1. Controleer of de pop-up direct open moet via de URL-parameter
    let urlParams = new URLSearchParams(window.location.search);
    
    // Selection & Booleans: controleer expliciet of het element bestaat
    if (urlParams.get('popup') === 'open' && rulesPopup !== null) {
        rulesPopup.showModal();
    }
}

function setupEventListeners() {
    // 2. Open pop-up (Selection)
    if (openBtn !== null && rulesPopup !== null) {
        openBtn.addEventListener('click', handleOpenClick);
    }

    // 3. Sluit pop-up
    if (closeBtn !== null && rulesPopup !== null) {
        closeBtn.addEventListener('click', handleCloseClick);
    }

    // 4. Navigeer naar aparte scoring.html
    if (scoringBtn !== null) {
        scoringBtn.addEventListener('click', handleScoringClick);
    }
}

// Losse handler functies (Functions)
function handleOpenClick() {
    rulesPopup.showModal();
}

function handleCloseClick() {
    rulesPopup.close();
}

function handleScoringClick() {
    globalThis.location.href = 'scoring.html';
}

// Initialize on DOM load met een standaard callback functie (geen arrow function)
document.addEventListener('DOMContentLoaded', initUI);