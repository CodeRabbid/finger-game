import { useState } from "react";

function App() {
  const [showBlue, setShowBlue] = useState(false);
  const [st1, setSt1] = useState(false);
  const [st2, setSt2] = useState(false);
  const [st3, setSt3] = useState(false);

  return (
    <div
      className="App"
      style={{
        height: 300,
        width: 300,
        backgroundColor: "yellow",
      }}
    >
      <div
        style={{
          left: 100,
          top: 100,
          height: 40,
          width: 40,
          backgroundColor: "red",
          position: "absolute",
        }}
        onPointerDown={() => setSt1(true)}
        onPointerUp={() => setSt1(false)}
      ></div>
      <div
        style={{
          left: 30,
          top: 30,
          height: 40,
          width: 40,
          backgroundColor: "red",
          position: "absolute",
        }}
        onPointerDown={() => setSt2(true)}
        onPointerUp={() => setSt2(false)}
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
      ></div>
      {st1 && st2 && (
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

export default App;
