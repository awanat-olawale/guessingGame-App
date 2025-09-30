class GameSession {
  constructor(id, masterId) {
    this.id = id;
    this.masterId = masterId;
    this.players = [];
    this.question = null;
    this.answer = null;
    this.active = false;
    this.timer = null;
  }
}

module.exports = GameSession;
