import { useState, useEffect, useContext } from "react";
import { Slider } from "@mui/material";
import axios from "axios";
import { SocketContext } from "../context/SocketContext.jsx";
import PopUp from "../components/PopUp.jsx";

const SetupChallenge = ({ numDots, setNumDots, dotSize, setDotSize }) => {
  const socket = useContext(SocketContext);

  const username = localStorage.getItem("username");
  const [sliderDots, setSliderDots] = useState([]);
  const [games, setGames] = useState([]);

  const [challengeReceiverName, setChallengeReceiverName] = useState("");
  const [challengeReceivedPopUp, setChallengeReceivedPopUp] = useState(false);
  const [challengeSentPopUp, setChallengeSentPopUp] = useState(false);
  const [challengerName, setChallengerName] = useState("");

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
  }, []);

  useEffect(() => {
    getGames();
  }, []);

  useEffect(() => {
    const slDots = [];
    for (let i = 0; i < numDots; i++) {
      slDots.push(0);
    }
    setSliderDots(slDots);
  }, [numDots]);

  const challenge = (gname) => {
    socket.emit("challenge", gname, username, numDots, dotSize);
    setChallengeReceiverName(gname);
    setChallengeSentPopUp(true);
  };

  const getGames = async () => {
    const { data } = await axios.post("/api/game/all", { username });
    setGames(data.games);
    console.log(data.games);
  };

  const handleAccept = () => {
    setChallengeReceivedPopUp(false);
    socket.emit("accepted", challengerName);
    socket.emit("join_game", challengerName, username, numDots);
    // navigate(`/game/select?gamename=${challengerName}`);
  };

  return (
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
          <div className="centered-content" style={{ width: 220, height: 20 }}>
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
  );
};

export default SetupChallenge;
