import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext.jsx";

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
      <div
        style={{
          display: "table",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "#fdff82",
        }}
      >
        <div
          style={{
            display: "table-cell",
            verticalAlign: "middle",
          }}
        >
          <div
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
        <div
          style={{
            display: "table",
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            backgroundColor: "",
          }}
        >
          <div
            style={{
              display: "table-cell",
              verticalAlign: "middle",
            }}
          >
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                display: "table",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  maxWidth: "200px",
                  minWidth: "200px",
                  minHeight: "100px",
                  backgroundColor: "white",
                  textAlign: "center",
                  borderColor: "blue",
                  borderStyle: "solid",
                  borderWidth: "5px",
                  borderShadow: "5px",
                  fontSize: "20px",
                }}
              >
                <p>Challenge from {challengerName}</p>
                <div
                  style={{
                    display: "inline-block",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      margin: "0px 7px 7px 10px",
                      padding: "7px 7px 7px 7px",
                      borderStyle: "solid",
                      borderWidth: "2px",
                    }}
                    onClick={() => setChallengePopUp(false)}
                  >
                    decline
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      margin: "0px 7px 7px 10px",
                      padding: "7px 7px 7px 7px",
                      borderStyle: "solid",
                      borderWidth: "2px",
                    }}
                    onClick={() => handleAccept()}
                  >
                    accept
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SelectRoom;
