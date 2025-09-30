const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

// REST API endpoints
router.post("/create", gameController.createSession);
router.post("/join", gameController.joinSession);
router.get("/", gameController.getSessions);
router.get("/:sessionId", gameController.getSessionDetails);

module.exports = router;
