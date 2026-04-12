const GROUPNUMBER = "14";
const GROUPTOKEN = "group14-9562-183";

const ERRORHANDLERSELECTOR = ".errormessages p";

const LOCALSERVER = `http://localhost:8080`;
const DEPLOYEDSERVER = `https://project-1.ti.howest.be/2025-2026/alpina/api`;
const GROUPDEPLOYEDSERVER = `https://project-1.ti.howest.be/2025-2026/group-${GROUPNUMBER}/api`;

const boardSize = 5 //HARDCODED

function getAPIUrl() {
  return DEPLOYEDSERVER;
}

export { getAPIUrl, GROUPTOKEN, ERRORHANDLERSELECTOR, boardSize };
