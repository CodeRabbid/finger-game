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
    name: "a",
    player1: { name: "a", state: "waiting", time: 0 },
    games_played: 0,
  },
  {
    name: "b",
    player1: { name: "b", state: "waiting", time: 0 },
    games_played: 0,
  },
  {
    name: "c",
    player1: { name: "c", state: "waiting", time: 0 },
    games_played: 0,
  },
];

app.post("/api/game/all", (req, res) => {
  const gamesWithoutUser = games.filter(
    (game) => game.name != req.body.username
  );
  res.json({ games: gamesWithoutUser });
});

app.post("/api/login", (req, res) => {
  const i = games.findIndex((g) => g.name == req.body.username);
  if (i == -1) {
    games.push({
      name: req.body.username,
      player1: { name: req.body.username, state: "waiting", time: 0 },
      games_played: 0,
    });
  }

  res.json({ username: req.body.username });
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
    console.log(gamename);
    console.log(username);
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
      game.games_played = 0;
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

    if (i != -1) {
      game.player1.state = nextState(game.player1.state);
      game.player2.state = nextState(game.player2.state);

      if (game.player1.name == username) {
        game.player1.time = delta;
      }
      if (game.player2.name == username) {
        game.player2.time = delta;
      }

      game.games_played += 1;
      console.log(game.games_played);
      console.log(delta);
      console.log("challenge_solved");
      games[i] = game;

      if (game.games_played >= 2) {
        socket.emit("game_over", game);
        socket.to(gamename).emit("game_over", game);
      } else {
        socket.emit("new_challenge", game);
        socket.to(gamename).emit("new_challenge", game);
      }
    }
  });

  socket.on("send_message", (data) => {
    // console.log(data);
    socket.broadcast.emit("receive_message", data);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING ON PORT 3001");
});
