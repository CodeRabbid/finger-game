import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const games = [
  {
    name: "g1",
    player1: { name: "a", state: "waiting" },
    turn: 20000,
    state: "player_1_sets_up",
  },
];

app.get("api/rooms", (req, res) => {
  console.log("here");
  res.json({ games });
});

app.post("api/game/create", (req, res) => {
  const gamename = req.body.gamename;
  const username = req.body.username;
  if (gamename != "" && username != "") {
    games[gamename] = { player1: username, time: 20000 };
  }
  res.json({ message: "success" });
});

app.get("/api/game/all", (req, res) => {
  console.log("games");
  res.json({ games });
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "..", "client", "dist", "index.html"))
);

const server = http.createServer(app);

const io = new Server(server, {
  path: "/api/socket.io",
  cors: {
    origin: ["https://finger-game.onrender.com", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_game", (gamename, username) => {
    const game = games.find((g) => g.name == gamename);
    if (game.player1.name != username) {
      game.player1 = {
        ...game.player1,
        state: "creating_challenge",
        time: 0,
      };
      game.player2 = {
        name: username,
        state: "waiting_for_challenge",
        time: 0,
      };
    }
    socket.join(gamename);
    socket.emit("joined", game);
    socket.to(gamename).emit("joined", game);
  });

  const nextState = (state) => {
    if (state == "creating_challenge") {
      return "waiting_for_opponent";
    } else if (state == "waiting_for_challenge") {
      return "solving_challenge";
    } else if (state == "solving_challenge") {
      return "creating_challenge";
    } else if (state == "waiting_for_opponent") {
      return "waiting_for_challenge";
    } else {
      return state;
    }
  };

  socket.on("challenge_created", (gamename, pos) => {
    var i = games.findIndex((g) => g.name == gamename);
    const game = games[i];

    game.player1.state = nextState(game.player1.state);
    game.player2.state = nextState(game.player2.state);

    games[i] = game;
    console.log("game_continues");
    socket.emit("game_continues", game, pos);
    socket.to(gamename).emit("game_continues", game, pos);
  });

  socket.on("challenge_solved", (gamename, username, delta) => {
    var i = games.findIndex((game) => game.name == gamename);
    const game = games[i];

    game.player1.state = nextState(game.player1.state);
    game.player2.state = nextState(game.player2.state);

    if (game.player1.name == username) {
      game.player1.time = delta;
    }
    if (game.player2.name == username) {
      game.player2.time = delta;
    }

    games[i] = game;
    console.log("challenge_solved");
    console.log(delta);
    console.log(game);
    socket.emit("new_challenge", game);
    socket.to(gamename).emit("new_challenge", game);
  });

  socket.on("send_message", (data) => {
    // console.log(data);
    socket.broadcast.emit("receive_message", data);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING ON PORT 3001");
});
