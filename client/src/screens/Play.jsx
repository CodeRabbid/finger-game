import io from "socket.io-client";
import { useEffect, useState, useContext } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import WaitingToJoin from "../components/WaitingToJoin";
import CreateChallenge from "../components/CreateChallenge";
import WaitingForChallenge from "../components/WaitingForChallenge";
import WaitingForOpponent from "../components/WaitingForOpponent";
import SolvingChallenge from "../components/SolvingChallenge";
import GameOver from "../components/GameOver";
import { SocketContext } from "../context/SocketContext.jsx";
// const socket = io("", {
//   path: "/api/socket.io",
//   autoConnect: false,
// });

const Play = () => {
  const socket = useContext(SocketContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const [username, setUsername] = useState(localStorage.getItem("username"));

  const [pos, setPos] = useState([]);
  const [finalPos, setFinalPos] = useState([]);
  const [gameProgress, setGameProgress] = useState();
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const gamename = searchParams.get("gamename");

    socket.emit("join_game", gamename, username);
    socket.on("joined", (game) => {
      setGameProgress(game);
    });
    socket.on("game_continues", (game, pos) => {
      console.log(game);
      console.log(pos);
      console.log("game_continues");
      setGameProgress(game);
      setFinalPos(pos);
      setPos([]);
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
    if (pos.length >= 1) {
      socket.emit("challenge_created", gameProgress.name, pos);
    }
  }, [pos]);

  const joinGame = (gname) => {
    socket.emit("join_game", gname, username);
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

  return (
    <>
      {gameOver ? (
        <GameOver gameProgress={gameProgress} />
      ) : currentScreen(gameProgress) == "waiting_to_join" ? (
        <WaitingToJoin />
      ) : currentScreen(gameProgress) == "creating_challenge" ? (
        <CreateChallenge pos={pos} setPos={setPos} />
      ) : currentScreen(gameProgress) == "waiting_for_challenge" ? (
        <WaitingForChallenge />
      ) : currentScreen(gameProgress) == "waiting_for_opponent" ? (
        <WaitingForOpponent />
      ) : currentScreen(gameProgress) == "solving_challenge" ? (
        <SolvingChallenge
          initialPos={finalPos}
          challengeSolved={challengeSolved}
          initialTime={getInitialTime(gameProgress)}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Play;
