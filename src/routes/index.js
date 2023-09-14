export const APP_URLS = {
  login: "/login",
  queue: "/turnos",
  admin: "/",
};

export const apiGatewayURL = "http://localhost:3002/";

export const ENDPOINTS = {
  auth: {
    getAuthenticationToken: `${apiGatewayURL}authentication/get-access-token/`,
    getAreas: `${apiGatewayURL}authentication/areas`,
  },
  patients: {
    searchPatient: `${apiGatewayURL}patients/`,
  },
  turns: {
    createTurn: `${apiGatewayURL}turns/`,
    updateTurnStatus: `${apiGatewayURL}turns/`,
    getTurns: `${apiGatewayURL}turns/today`,
  },
};
