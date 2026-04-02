import {fetchFromServer} from "../data-connector/api-communication-abstractor.js";

function fetchAllCards() {
  return fetchFromServer("/cards");
}

export{fetchAllCards}