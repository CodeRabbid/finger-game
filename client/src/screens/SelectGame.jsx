import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SelectRoom = ({
  username,
  setUsername,
  gamename,
  setGamename,
  joinGame,
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    getGames();
  }, []);

  const [games, setGames] = useState([]);

  const login = async () => {
    localStorage.setItem("username", username);
  };

  const getGames = async () => {
    const { data } = await axios("/api/game/all");
    setGames(data.games);
    console.log(data.games);
  };

  const createGame = async () => {
    const { data } = await axios.post("/game/create", {
      gamename,
      username,
    });
    console.log(data.message);
  };
  return (
    <div>
      <input
        value={username}
        placeholder="Type in your name"
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={login}>Login</button>
      <br />
      <input
        value={gamename}
        placeholder="Create a game"
        onChange={(e) => setGamename(e.target.value)}
      />
      <button onClick={createGame}>Create</button>
      <br />
      <div>Games: </div>
      <button onClick={() => getGames()}>Get games</button>
      {games.map((game) => (
        <div key={game.name}>
          <span>
            {game.name} p1: {game.player1.name} p2: {game.player2?.name}
          </span>
          <button
            onClick={() => navigate(`/game/select?gamename=${game.name}`)}
          >
            join game
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectRoom;
