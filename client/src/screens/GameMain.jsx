import { useEffect, useState, useContext } from "react";

import { SocketContext } from "../context/SocketContext.jsx";

import WaitingToJoin from "./WaitingToJoin.jsx";
import CreateChallenge from "./CreateChallenge.jsx";
import WaitingForChallenge from "./WaitingForChallenge.jsx";
import WaitingForOpponent from "./WaitingForOpponent.jsx";
import SolvingChallenge from "./SolvingChallenge.jsx";
import GameOver from "./GameOver.jsx";
import SetupChallenge from "./SetupChallenge.jsx";

const SelectRoom = () => {
  const username = localStorage.getItem("username");
  const socket = useContext(SocketContext);

  const [numDots, setNumDots] = useState(1);
  const [dotSize, setDotSize] = useState(60);

  const [gameProgress, setGameProgress] = useState();
  const [gameOver, setGameOver] = useState(false);
  const [dots, setDots] = useState([]);
  const [finalPos, setFinalPos] = useState([]);

  socket.connect();

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("login", username);
    });

    socket.on("joined", (game) => {
      setGameProgress(game);
    });

    socket.on("game_continues", (game, pos, id) => {
      console.log("game_continues");
      setGameProgress(game);
      setFinalPos(pos);
      setDots([]);
    });

    socket.on("new_challenge", (game) => {
      console.log(game);
      console.log("new_challenge");
      setGameProgress(game);
    });
    socket.on("game_over", (game) => {
      console.log("game_over");
      setGameProgress(game);
      setGameOver(game);
    });
  }, []);

  useEffect(() => {
    if (dots.length >= numDots) {
      socket.emit("challenge_created", gameProgress.name, dots);
    }
  }, [dots]);

  const getInitialTime = (gameProgress) => {
    if (gameProgress.player1.name == username) {
      return gameProgress.player1.time;
    } else if (gameProgress.player2.name == username) {
      console.log(gameProgress.player2.time);
      return gameProgress.player2.time;
    }
  };

  const challengeSolved = (delta) => {
    socket.emit("challenge_solved", gameProgress.name, username, delta);
  };

  const currentScreen = (gameProgress) => {
    if (!gameProgress) {
      return "choose_game";
    } else if (!gameProgress.player2) {
      return "waiting_to_join";
    } else {
      if (gameProgress.player1.name == username) {
        console.log(gameProgress.player1.state);
        return gameProgress.player1.state;
      } else if (gameProgress.player2.name == username) {
        console.log(gameProgress.player2.state);
        return gameProgress.player2.state;
      }
    }
  };

  const newGame = () => {
    setGameOver(false);
    setGameProgress(null);
  };

  return (
    <>
      {currentScreen(gameProgress) == "choose_game" ? (
        <SetupChallenge
          numDots={numDots}
          setNumDots={setNumDots}
          dotSize={dotSize}
          setDotSize={setDotSize}
        />
      ) : gameOver ? (
        <GameOver gameProgress={gameProgress} newGame={newGame} />
      ) : currentScreen(gameProgress) == "waiting_to_join" ? (
        <WaitingToJoin />
      ) : currentScreen(gameProgress) == "creating_challenge" ? (
        <CreateChallenge pos={dots} setPos={setDots} dotSize={dotSize} />
      ) : currentScreen(gameProgress) == "waiting_for_challenge" ? (
        <WaitingForChallenge />
      ) : currentScreen(gameProgress) == "waiting_for_opponent" ? (
        <WaitingForOpponent />
      ) : currentScreen(gameProgress) == "solving_challenge" ? (
        <SolvingChallenge
          initialPos={finalPos}
          challengeSolved={challengeSolved}
          initialTime={getInitialTime(gameProgress)}
          numDots={numDots}
          dotSize={dotSize}
        />
      ) : (
        ""
      )}
    </>
  );
};
export default SelectRoom;
