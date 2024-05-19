import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
const socket = io("", { autoConnect: false });

function Game() {
  const [showBlue, setShowBlue] = useState(false);
  const [st1, setSt1] = useState(false);
  const [st2, setSt2] = useState(false);
  const [st3, setSt3] = useState(false);
  const [pos, setPos] = useState([20, 20]);
  const [id, setId] = useState();

  const ref = useRef();

  useEffect(() => {
    // socket.emit("send_message", { pos: pos });
  }, [pos]);

  useEffect(() => {
    socket.connect();
    socket.on("connect", (data) => {
      setId(socket.id);
    });
    socket.on("receive_message", (data) => {
      setPos(data.pos);
    });
    socket.on("response", (data) => {
      console.log(data);
    });
  }, []);

  const joinRoom1 = () => {
    socket.emit("join_room", "room1");
  };

  return (
    <div
      className="App"
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "yellow",
      }}
      ref={ref}
      // onTouchStart={(e) => {
      //   const touch = e.touches[0];
      //   setPos([
      //     (touch.pageX / ref.current.offsetWidth) * 100,
      //     (touch.pageY / ref.current.offsetHeight) * 100,
      //   ]);
      // }}
    >
      <button onClick={joinRoom1}>Join Room 1</button>
      <div>My id is {id}</div>
      <div
        style={{
          left: `calc(${pos[0]}% - 25px)`,
          top: `calc(${pos[1]}% - 25px)`,
          // left: 100,
          // top: 100,
          backgroundColor: "blue",
          height: 50,
          width: 50,
          position: "absolute",
        }}
        onTouchStart={() => setShowBlue(true)}
        onTouchEnd={() => setShowBlue(false)}
        onTouchCancel={() => setShowBlue(false)}
        onTouchMove={() => setShowBlue(false)}
      ></div>
      {/* <div
        style={{
          left: 30,
          top: 200,
          height: 40,
          width: 40,
          backgroundColor: "red",
          position: "absolute",
        }}
        onTouchStart={() => showBlue(true)}
        // onPointerUp={() => setSt1(false)}
        // onPointerMove={() => setSt1(false)}
      ></div> */}
      <div
        style={{
          left: 30,
          top: 30,
          height: 40,
          width: 40,
          backgroundColor: "green",
          position: "absolute",
        }}
        onPointerDown={() => setSt1(true)}
        onPointerUp={() => setSt1(false)}
        onPointerMove={() => setSt1(false)}
      ></div>
      <div
        style={{
          left: 70,
          top: 30,
          height: 40,
          width: 40,
          backgroundColor: "red",
          position: "absolute",
        }}
        onPointerDown={() => setSt2(true)}
        onPointerUp={() => setSt2(false)}
        onPointerMove={() => setSt2(false)}
      ></div>
      <div
        style={{
          left: 30,
          top: 130,
          height: 40,
          width: 40,
          backgroundColor: "red",
          position: "absolute",
        }}
        onPointerDown={() => setSt3(true)}
        onPointerUp={() => setSt3(false)}
        onPointerMove={() => setSt3(false)}
      ></div>
      {showBlue && (
        <div
          style={{
            left: 130,
            top: 170,
            height: 40,
            width: 40,
            backgroundColor: "blue",
            position: "absolute",
          }}
        ></div>
      )}
    </div>
  );
}

export default Game;
