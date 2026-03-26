import { loadFromStorage } from "./data-connector/local-storage-abstractor.js"

function init() {

}

function getPlayerToken() {
    return loadFromStorage("playerToken");
}

init();