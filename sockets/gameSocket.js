const { sessions } = require("../controllers/gameController");

module.exports = (io, socket) => {
  // Game master sets question + answer
  socket.on("setQuestion", ({ sessionId, question, answer }) => {
    const session = sessions[sessionId];
    if (!session) return;

    session.question = question;
    session.answer = answer.toLowerCase();
    session.active = true;

    io.to(sessionId).emit("questionSet", { question });
    console.log(`Question set for session ${sessionId}`);
  });

  // Player joins via socket
  socket.on("joinGame", ({ sessionId, playerId }) => {
    socket.join(sessionId);
    io.to(sessionId).emit("playerJoined", { playerId, players: sessions[sessionId].players });
  });

  // Handle guesses
  socket.on("guess", ({ sessionId, playerId, guess }) => {
    const session = sessions[sessionId];
    if (!session || !session.active) return;

    const player = session.players.find(p => p.id === playerId);
    if (!player || player.attemptsLeft <= 0) return;

    player.attemptsLeft--;

    if (guess.toLowerCase() === session.answer) {
      player.score += 10;
      session.active = false;
      io.to(sessionId).emit("gameOver", {
        winner: player.name,
        answer: session.answer,
        scores: session.players
      });
    } else {
      socket.emit("wrongGuess", { attemptsLeft: player.attemptsLeft });
    }
  });

  // Handle session timer (basic setup)
  socket.on("startTimer", ({ sessionId }) => {
    const session = sessions[sessionId];
    if (!session) return;

    session.timer = setTimeout(() => {
      if (session.active) {
        session.active = false;
        io.to(sessionId).emit("timeUp", {
          answer: session.answer,
          scores: session.players
        });
      }
    }, 60000); // 60s
  });
};
