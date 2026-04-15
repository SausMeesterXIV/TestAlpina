function renderLeaderboard(players, showHikers = true) {
    const $target = document.querySelector("tbody");
    const $fragment = document.createDocumentFragment();
    const sortedPlayers = getSortedPlayers(players);
    sortedPlayers.forEach((player, idx) => {
        const $template = document.querySelector("#leaderboard-template");
        const $clone = document.importNode($template.content, true);

        $clone.querySelector(".leaderboard-pos").textContent = `#${idx + 1}`;
        $clone.querySelector(".leaderboard-name").textContent = player.name;
        if (showHikers) { // This is to ensure we can re-use the function in both the game.html and end-screen.html. Game: showHikers = true; end-screen: showHikers = false;
            $clone.querySelector(".leaderboard-hikers").textContent = player.hikersLeft;
        }
        $clone.querySelector(".leaderboard-points").textContent = player.score;

        $fragment.appendChild($clone);
    });
    $target.replaceChildren($fragment);
}

function getSortedPlayers(players) {
    return players.sort((a, b) => b.score - a.score); // If the result is positive, it will move b in front of a. Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
}

export {
  renderLeaderboard
};