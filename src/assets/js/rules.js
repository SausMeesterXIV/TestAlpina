// Selecteer de dialoogvensters (Let op: CamelCase gebruiken voor variabelen!)
const rulesPopup = document.getElementById('settings-popup');

// 1. Open de spelregels (Modal)
const openBtn = document.getElementById('open-settings-btn');
if (openBtn) {
    openBtn.onclick = () => {
        rulesPopup.showModal();
    };
}

// 2. Sluit de spelregels popup
const closeBtn = document.getElementById('close-settings-btn');
if (closeBtn) {
    closeBtn.onclick = () => {
        rulesPopup.close();
    };
}

// 3. Ga van de regels-popup naar de aparte scoring pagina
const scoringBtn = document.getElementById('open-scoring-btn');
if (scoringBtn) {
    scoringBtn.onclick = () => {
        // Navigeer direct naar de andere HTML pagina
        window.location.href = 'scoring.html';
    };
}