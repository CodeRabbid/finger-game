import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { SocketContext } from "../context/SocketContext.jsx";
import PopUp from "../components/PopUp.jsx";
import { Slider } from "@mui/material";

import WaitingToJoin from "./WaitingToJoin.jsx";
import CreateChallenge from "./CreateChallenge.jsx";
import WaitingForChallenge from "./WaitingForChallenge.jsx";
import WaitingForOpponent from "./WaitingForOpponent.jsx";
import SolvingChallenge from "./SolvingChallenge.jsx";
import Dot from "../components/Dot.jsx";
import GameOver from "./GameOver.jsx";

const SelectRoom = () => {
  const username = localStorage.getItem("username");
  const socket = useContext(SocketContext);
  const [challengeReceivedPopUp, setChallengeReceivedPopUp] = useState(false);
  const [challengeSentPopUp, setChallengeSentPopUp] = useState(false);
  const [challengerName, setChallengerName] = useState("");
  const [challengeReceiverName, setChallengeReceiverName] = useState("");
  const [numDots, setNumDots] = useState(1);
  const [dotSize, setDotSize] = useState(60);

  const [gameProgress, setGameProgress] = useState();
  const [gameOver, setGameOver] = useState(false);
  const [dots, setDots] = useState([]);
  const [finalPos, setFinalPos] = useState([]);

  const [sliderDots, setSliderDots] = useState([]);

  socket.connect();

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("login", username);
    });
    socket.on("challenge_received", (challenger, numDots, dotSize) => {
      setDotSize(dotSize);
      setNumDots(numDots);
      setChallengerName(challenger);
      setChallengeReceivedPopUp(true);
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

    socket.on("accepted", () => {
      //   navigate(`/game/select?gamename=${username}&num_dots=${numDots}`);
    });

    getGames();
  }, []);

  useEffect(() => {
    if (dots.length >= numDots) {
      socket.emit("challenge_created", gameProgress.name, dots);
    }
  }, [dots]);

  useEffect(() => {
    const slDots = [];
    for (let i = 0; i < numDots; i++) {
      slDots.push(0);
    }
    setSliderDots(slDots);
  }, [numDots]);

  const [games, setGames] = useState([]);

  const getGames = async () => {
    const { data } = await axios.post("/api/game/all", { username });
    setGames(data.games);
    console.log(data.games);
  };

  const challenge = (gname) => {
    socket.emit("challenge", gname, username, numDots, dotSize);
    setChallengeReceiverName(gname);
    setChallengeSentPopUp(true);
  };

  const handleAccept = () => {
    setChallengeReceivedPopUp(false);
    socket.emit("accepted", challengerName);
    socket.emit("join_game", challengerName, username, numDots);
    // navigate(`/game/select?gamename=${challengerName}`);
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
    setChallengeSentPopUp(false);
    setGameProgress(null);
  };

  return (
    <>
      {currentScreen(gameProgress) == "choose_game" ? (
        <div>
          <div className="center-container-1">
            <div className="center-container-2">
              <div
                className="centered-content"
                style={{ fontWeight: "normal", fontSize: 25 }}
              >
                Setup challenge:
              </div>
              <br />
              <div
                className="centered-content"
                style={{ width: 220, height: 20 }}
              >
                {sliderDots.map((num) => {
                  console.log(num);
                  return (
                    <div
                      style={{
                        float: "left",
                        height: 20,
                        width: 20,
                        backgroundColor: "var(--dot-color)",
                        borderRadius: "50%",
                      }}
                    ></div>
                  );
                })}
              </div>
              <div className="centered-content">
                <Slider
                  style={{ width: 200, color: "orange" }}
                  min={1}
                  max={11}
                  aria-label="numDots"
                  value={numDots}
                  onChange={(e) => {
                    setNumDots(e.target.value);
                  }}
                />
              </div>
              <div
                className="centered-content"
                style={{ fontWeight: "normal", fontSize: 25 }}
              >
                <Slider
                  style={{ width: 200, color: "orange" }}
                  min={20}
                  max={100}
                  aria-label="dotSize"
                  value={dotSize}
                  onChange={(e) => {
                    setDotSize(e.target.value);
                  }}
                />
              </div>
              <div
                className="centered-content"
                style={{
                  display: "table",
                  height: 100,
                  width: 100,
                }}
              >
                <div className="center-container-2">
                  <div
                    className="centered-content"
                    style={{
                      height: dotSize,
                      width: dotSize,
                      backgroundColor: "var(--dot-color)",
                      borderRadius: "50%",
                    }}
                  ></div>
                </div>
              </div>
              <br />
              <div
                className="centered-content"
                style={{ fontWeight: "normal", fontSize: 25 }}
              >
                Choose an opponent:
              </div>
              <br />
              {games.map((game) => (
                <div
                  key={game.name}
                  style={{
                    fontFamily: "Arial, sans-serif",
                    fontWeight: "bold",
                    color: "orange",
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "table",
                    position: "relative",
                    fontSize: "30px",
                  }}
                  onClick={() => challenge(game.name, username)}
                >
                  {game.name}
                </div>
              ))}
            </div>
          </div>

          {challengeReceivedPopUp ? (
            <PopUp
              onDecline={() => setChallengeReceivedPopUp(false)}
              onAccept={() => handleAccept()}
              text={`Challenge from ${challengerName}`}
              declineText={"Decline"}
            />
          ) : (
            ""
          )}
          {challengeSentPopUp ? (
            <PopUp
              onDecline={() => setChallengeSentPopUp(false)}
              text={`Waiting for ${challengeReceiverName} to accept... `}
              declineText={"Cancel"}
            />
          ) : (
            ""
          )}
        </div>
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

  return (
    <div>
      <div className="center-container-1">
        <div className="center-container-2">
          <div
            className="centered-content"
            style={{ fontWeight: "normal", fontSize: 25 }}
          >
            Number of dots:
          </div>
          <br />
          <div
            className="centered-content"
            style={{ fontWeight: "normal", fontSize: 25 }}
          >
            <Slider
              style={{ width: 150, color: "orange" }}
              min={1}
              max={5}
              aria-label="numDots"
              value={numDots}
              valueLabelDisplay="auto"
              onChange={(e) => {
                setNumDots(e.target.value);
              }}
            />
          </div>
          <br />
          <div
            className="centered-content"
            style={{ fontWeight: "normal", fontSize: 25 }}
          >
            Choose an opponent:
          </div>
          <br />
          {games.map((game) => (
            <div
              key={game.name}
              style={{
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
                color: "orange",
                marginLeft: "auto",
                marginRight: "auto",
                display: "table",
                position: "relative",
                fontSize: "30px",
              }}
              onClick={() => challenge(game.name, username)}
            >
              {game.name}
            </div>
          ))}
        </div>
      </div>

      {challengeReceivedPopUp ? (
        <PopUp
          onDecline={() => setChallengeReceivedPopUp(false)}
          onAccept={() => handleAccept()}
          text={`Challenge from ${challengerName}`}
          declineText={"Decline"}
        />
      ) : (
        ""
      )}
      {challengeSentPopUp ? (
        <PopUp
          onDecline={() => setChallengeSentPopUp(false)}
          text={`Waiting for ${challengeReceiverName} to accept... `}
          declineText={"Cancel"}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default SelectRoom;
