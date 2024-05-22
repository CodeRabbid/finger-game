import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Game from "../models/gameModel.js";
import jwt from "jsonwebtoken";

// @desc    Register a new user
// @route   POST /api/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    username,
    password,
  });

  const game = await Game.create({
    name: username,
    player1: { name: username, state: "waiting", time: 0 },
  });

  if (user && game) {
    const payload = { _id: user._id };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET);
    await user.save();
    await game.save();
    res.json({
      access_token,
      username,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    const payload = { _id: user._id };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET);

    res.json({
      access_token,
      username,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export { registerUser, authUser };
