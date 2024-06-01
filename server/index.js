import "dotenv/config";
import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import { authUser, registerUser } from "./controllers/userControllers.js";
import Game from "./models/gameModel.js";
import asyncHandler from "express-async-handler";

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/register", registerUser);
app.post("/api/login", authUser);

app.post(
  "/api/game/all",
  asyncHandler(async (req, res) => {
    const gamenamesWithoutUser = await Game.find({
      name: { $ne: req.body.username },
    }).select("name -_id");
    res.json({ games: gamenamesWithoutUser });
  })
);

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

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_game", async (gamename, username, numDots) => {
    // const game = games.find((g) => g.name == gamename);
    const game = await Game.findOne({ name: gamename });
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
      game.num_dots = numDots;
    }
    game.num_dots = numDots ? numDots : 0;
    await game.save();
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

  socket.on("challenge_created", async (gamename, pos) => {
    const game = await Game.findOne({ name: gamename });

    game.player1 = { ...game.player1, state: nextState(game.player1.state) };
    game.player2 = { ...game.player2, state: nextState(game.player2.state) };

    await game.save();
    socket.emit("game_continues", game);
    socket.to(gamename).emit("game_continues", game, pos, socket.id);
  });

  socket.on("login", (username) => {
    socket.join(username);
    console.log(username + " joined it's room");
  });

  socket.on("challenge", (username, challenger_username, numDots, dotSize) => {
    socket
      .to(username)
      .emit("challenge_received", challenger_username, numDots, dotSize);
  });

  socket.on("challenge_solved", async (gamename, username, delta) => {
    const game = await Game.findOne({ name: gamename });

    game.player1 = { ...game.player1, state: nextState(game.player1.state) };
    game.player2 = { ...game.player2, state: nextState(game.player2.state) };

    if (game.player1.name == username) {
      game.player1.time = delta;
    }
    if (game.player2.name == username) {
      game.player2.time = delta;
    }

    game.games_played += 1;
    await game.save();

    if (game.games_played >= 6) {
      socket.emit("game_over", game);
      socket.to(gamename).emit("game_over", game);
    } else {
      socket.emit("new_challenge", game);
      socket.to(gamename).emit("new_challenge", game);
    }

    await game.save();
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING ON PORT 3001");
});
