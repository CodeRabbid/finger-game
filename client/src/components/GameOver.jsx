import { Button } from "@mui/material";

const GameOver = ({ gameProgress, newGame }) => {
  const time1 = new Date(gameProgress.player1.time);
  const time2 = new Date(gameProgress.player2.time);
  let winner = gameProgress.player1.name;
  if (time1 > time2) {
    winner = gameProgress.player2.name;
  }
  return (
    <>
      <div className="center-container-1">
        <div className="center-container-2">
          <div className="centered-content">
            {gameProgress.player1.name} -{" "}
            {String(time1.getMinutes()).padStart(2, "0")}:
            {String(time1.getSeconds()).padStart(2, "0")}:
            {String(Math.floor(time1.getMilliseconds() / 10)).padStart(2, "0")}
          </div>
          <div className="centered-content">
            {gameProgress.player2.name} -{" "}
            {String(time2.getMinutes()).padStart(2, "0")}:
            {String(time2.getSeconds()).padStart(2, "0")}:
            {String(Math.floor(time2.getMilliseconds() / 10)).padStart(2, "0")}
          </div>
          <br />
          <div className="centered-content">{winner} is the winner! 🎉🎉🎉</div>
          <br />
          <div className="centered-content">
            <Button
              variant="contained"
              style={{
                height: 56,
                width: 195,
                display: "inline-block",
                margin: "0px 7px 7px 10px",
                padding: "7px 7px 7px 7px",
                backgroundColor: "orange",
                color: "white",
                borderStyle: "solid",
                borderColor: "orange",
                borderWidth: "2px",
                fontSize: 20,
              }}
              onClick={() => newGame()}
            >
              New Game
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameOver;
