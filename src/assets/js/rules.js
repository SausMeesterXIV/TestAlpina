// Selecteer de twee dialoogvensters
const rulesPopup = document.getElementById('settingsPopup');
const scoringPopup = document.getElementById('scoringPopup');

// 1. Open de spelregels
document.getElementById('openSettingsBtn').onclick = () => {
    rulesPopup.showModal();
};

// 2. Sluit de spelregels
document.getElementById('closeSettingsBtn').onclick = () => {
    rulesPopup.close();
};

// 3. Ga van spelregels naar scoring
document.getElementById('openScoringBtn').onclick = () => {
    rulesPopup.close();
    scoringPopup.showModal();
};

// 4. Sluit scoring (of voeg een terug-knop toe)
document.getElementById('closeScoringBtn').onclick = () => {
    scoringPopup.close();
};