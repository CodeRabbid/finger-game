import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext.jsx";
import PopUp from "../components/PopUp.jsx";

const SelectRoom = ({ gamename, setGamename }) => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [challengePopUp, setChallengePopUp] = useState(false);
  const [challengerName, setChallengerName] = useState("");
  socket.connect();

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("login", username);
    });
    socket.on("challenge_received", (challenger) => {
      setChallengerName(challenger);
      setChallengePopUp(true);
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
  };

  const handleAccept = () => {
    console.log("accepting challenge");
    setChallengePopUp(false);
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

      {challengePopUp ? (
        <PopUp
          onDecline={() => setChallengePopUp(false)}
          onAccept={() => handleAccept()}
          text={`Challenge from ${challengerName}`}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default SelectRoom;
