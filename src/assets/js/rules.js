class SettingsController {
    constructor() {
        // Domelementen ophalen via querySelector
        this.rulesPopup = document.querySelector('#settings-popup');
        this.openBtn = document.querySelector('#open-settings-btn');
        this.closeBtn = document.querySelector('#close-settings-btn');
        this.scoringBtn = document.querySelector('#open-scoring-btn');

        this.initUI();
    }

    initUI() {
        this.checkUrlParams();
        this.setupEventListeners();
    }

    checkUrlParams() {
        // 1. Controleer of de pop-up direct open moet via de URL-parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('popup') === 'open' && this.rulesPopup) {
            this.rulesPopup.showModal();
        }
    }

    setupEventListeners() {
        // 2. Open pop-up
        if (this.openBtn && this.rulesPopup) {
            this.openBtn.addEventListener('click', () => this.handleOpenClick());
        }

        // 3. Sluit pop-up
        if (this.closeBtn && this.rulesPopup) {
            this.closeBtn.addEventListener('click', () => this.handleCloseClick());
        }

        // 4. Navigeer naar aparte scoring.html
        if (this.scoringBtn) {
            this.scoringBtn.addEventListener('click', () => this.handleScoringClick());
        }
    }

    handleOpenClick() {
        this.rulesPopup.showModal();
    }

    handleCloseClick() {
        this.rulesPopup.close();
    }

    handleScoringClick() {
        window.location.href = 'scoring.html';
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.settingsController = new SettingsController();
});