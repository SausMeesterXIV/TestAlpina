const GROUPNUMBER = "<GROUP-NUMBER>";
const GROUPTOKEN = "<GROUP-TOKEN>";

const ERRORHANDLERSELECTOR = ".errormessages p";

const LOCALSERVER = `http://localhost:8080`;
const DEPLOYEDSERVER = `https://project-1.ti.howest.be/2025-2026/alpina/api`;
const GROUPDEPLOYEDSERVER = `https://project-1.ti.howest.be/2025-2026/group-${GROUPNUMBER}/api`;

function getAPIUrl() {
  return DEPLOYEDSERVER;
}

export { getAPIUrl, GROUPTOKEN, ERRORHANDLERSELECTOR };
