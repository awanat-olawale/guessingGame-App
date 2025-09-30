const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const gameRoutes = require("./routes/gameRoutes");
const gameSocket = require("./sockets/gameSocket");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// REST routes
app.use("/api/games", gameRoutes);

// Pages
app.get("/", (req, res) => res.render("index"));
app.get("/lobby/:sessionId", (req, res) => res.render("lobby", { sessionId: req.params.sessionId }));
app.get("/game/:sessionId", (req, res) => res.render("game", { sessionId: req.params.sessionId }));

// Socket.io
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  gameSocket(io, socket);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
