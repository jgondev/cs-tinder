const service = require("../services/api.service");
const middleware = require("../middleware/auth.middleware");

module.exports = function (app) {
  app.post("/api/login", service.login);
  app.get("/api/players", service.getPlayers);
  app.post("/api/faceit", [middleware.verifyToken], service.faceit);
  app.post("/api/faceit/update", [middleware.verifyToken], service.faceitUpdate);
  app.post("/api/faceit/teams", [middleware.verifyToken], service.faceitTeams);
  app.post("/api/requests/send", [middleware.verifyToken], service.requestCouple);
  app.post("/api/requests/accept", [middleware.verifyToken], service.acceptCouple);
  app.post("/api/requests/decline", [middleware.verifyToken], service.declineCouple);
  app.post("/api/requests/cancel", [middleware.verifyToken], service.cancelRequest);
  app.get("/api/requests", [middleware.verifyToken], service.getRequests);
  app.get("/api/couples/mine", [middleware.verifyToken], service.getCouple);
  app.post("/api/couples/mine/break", [middleware.verifyToken], service.breakCouple);
  app.post("/api/gg", [middleware.verifyToken], service.gg);
  app.get("/api/system/update", service.systemUpdates)
};
