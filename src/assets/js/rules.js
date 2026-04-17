function init() {
    document.querySelector("#open-scoring-btn").addEventListener("click", toggleScorebook);
    document.querySelector("#close-scoring-btn").addEventListener("click", toggleScorebook);
}

function toggleScorebook() {
    document.querySelector("#scorebook").classList.toggle("hidden");
    document.querySelector("#settings-popup").classList.toggle("hidden");
}

init();