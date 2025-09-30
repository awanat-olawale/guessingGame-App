const sessions = {}; // in-memory store { sessionId: GameSession }

exports.createSession = (req, res) => {
  const { sessionId, masterId } = req.body;
  if (sessions[sessionId]) {
    return res.status(400).json({ msg: "Session already exists" });
  }
  const GameSession = require("../models/gameSession");
  sessions[sessionId] = new GameSession(sessionId, masterId);
  res.json({ msg: "Game session created", session: sessions[sessionId] });
};

exports.joinSession = (req, res) => {
  const { sessionId, playerId, name } = req.body;
  const session = sessions[sessionId];
  if (!session) {
    return res.status(404).json({ msg: "Session not found" });
  }
  const Player = require("../models/player");
  const newPlayer = new Player(playerId, name);
  session.players.push(newPlayer);
  res.json({ msg: "Joined successfully", players: session.players });
};

exports.getSessions = (req, res) => {
  res.json(Object.keys(sessions));
};

exports.getSessionDetails = (req, res) => {
  const { sessionId } = req.params;
  const session = sessions[sessionId];
  if (!session) return res.status(404).json({ msg: "Session not found" });
  res.json(session);
};

module.exports.sessions = sessions; // expose for socket
