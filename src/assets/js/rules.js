function init() {
    document.querySelector("#open-scoring-btn").addEventListener("click", toggleScorebook);
    document.querySelector("#close-scoring-btn").addEventListener("click", toggleScorebook);
    document.querySelector("#close-settings-btn").addEventListener("click", closeSettings);
}

function toggleScorebook() {
    document.querySelector("#scorebook").classList.toggle("hidden");
    document.querySelector("#settings-popup").classList.toggle("hidden");
}

function closeSettings() {
    // document.referrer = page that referred to rules.html
    document.referrer ? window.location.href = document.referrer : window.location.href = "index.html"; // === "If a page referred to this page, send the user back to that page. If not, send them to index.html"
}

init();