import { useNavigate } from "react-router-dom";

const GameOver = ({ gameProgress }) => {
  const navigate = useNavigate();

  const time1 = new Date(gameProgress.player1.time);
  const time2 = new Date(gameProgress.player2.time);
  let winner = gameProgress.player1.name;
  if (time1 > time2) {
    winner = gameProgress.player2.name;
  }
  return (
    <>
      <div
        style={{
          display: "table",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "yellow",
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
              fontSize: "40px",
            }}
          >
            {gameProgress.player1.name} -{" "}
            {String(time1.getMinutes()).padStart(2, "0")}:
            {String(time1.getSeconds()).padStart(2, "0")}:
            {String(Math.floor(time1.getMilliseconds() / 10)).padStart(2, "0")}
          </div>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              display: "table",
              position: "relative",
              fontSize: "40px",
            }}
          >
            {gameProgress.player2.name} -{" "}
            {String(time2.getMinutes()).padStart(2, "0")}:
            {String(time2.getSeconds()).padStart(2, "0")}:
            {String(Math.floor(time2.getMilliseconds() / 10)).padStart(2, "0")}
          </div>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              display: "table",
              position: "relative",
              fontSize: "40px",
            }}
          >
            {winner} is the winner!
          </div>
          <button
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              display: "table",
              position: "relative",
              fontSize: "40px",
            }}
            onClick={() => navigate("/game/select")}
          >
            New Game
          </button>
        </div>
      </div>
    </>
  );
};

export default GameOver;
