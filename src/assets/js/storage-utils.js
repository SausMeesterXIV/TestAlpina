import {loadFromStorage, saveToStorage} from "./data-connector/local-storage-abstractor.js";

function getGameId(){
  return loadFromStorage("gameId");
}

function getPlayerToken(){
  return loadFromStorage("playerToken")
}

function getHiker() {
  return loadFromStorage("hiker")
}

export {getHiker, getGameId, getPlayerToken}