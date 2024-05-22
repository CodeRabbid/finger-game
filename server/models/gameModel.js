import mongoose from "mongoose";

const gameSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    player1: {
      type: Object,
      required: true,
      default: {},
    },
    player2: {
      type: Object,
      required: true,
      default: {},
    },
    games_played: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;
