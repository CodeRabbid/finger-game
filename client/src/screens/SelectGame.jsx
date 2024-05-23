import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext.jsx";
import PopUp from "../components/PopUp.jsx";

const SelectRoom = ({ gamename, setGamename }) => {
  const username = localStorage.getItem("username");
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [challengeReceivedPopUp, setChallengeReceivedPopUp] = useState(false);
  const [challengeSentPopUp, setChallengeSentPopUp] = useState(false);
  const [challengerName, setChallengerName] = useState("");
  const [challengeReceiverName, setChallengeReceiverName] = useState("");
  socket.connect();

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("login", username);
    });
    socket.on("challenge_received", (challenger) => {
      setChallengerName(challenger);
      setChallengeReceivedPopUp(true);
    });

    socket.on("accepted", () => {
      navigate(`/game/select?gamename=${username}`);
    });

    getGames();
  }, []);

  const [games, setGames] = useState([]);

  const getGames = async () => {
    const { data } = await axios.post("/api/game/all", { username });
    setGames(data.games);
    console.log(data.games);
  };

  const challenge = (gname) => {
    socket.emit("challenge", gname, username);
    setChallengeReceiverName(gname);
    setChallengeSentPopUp(true);
  };

  const handleAccept = () => {
    console.log("accepting challenge");
    setChallengeReceivedPopUp(false);
    socket.emit("accepted", challengerName);
    navigate(`/game/select?gamename=${challengerName}`);
  };
  return (
    <div>
      <div className="center-container-1">
        <div className="center-container-2">
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
