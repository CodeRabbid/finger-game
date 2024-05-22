import { useEffect, useState } from "react";

const SolvingChallenge = ({ initialPos, challengeSolved, initialTime }) => {
  const beginning = new Date();
  const [clicked, setClicked] = useState([false]);
  const [time, setTime] = useState(
    new Date(Math.abs(new Date() - beginning + initialTime))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date(Math.abs(new Date() - beginning + initialTime)));
    }, 10);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (clicked[0]) {
      console.log(Math.abs(time));
      challengeSolved(Math.abs(time));
      setClicked([false]);
    }
  }, [clicked]);

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "table",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "table-cell",
            verticalAlign: "middle",
          }}
        >
          <div
            className="centered-content"
            style={{ fontSize: 40, color: "#ffc445" }}
          >
            {String(time.getMinutes()).padStart(2, "0")}:
            {String(time.getSeconds()).padStart(2, "0")}:
            {String(Math.floor(time.getMilliseconds() / 10)).padStart(2, "0")}
          </div>
        </div>
      </div>
      {initialPos.map((p, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `calc(${p[0]}% - 20px)`,
            top: `calc(${p[1]}% - 20px)`,
            height: 40,
            width: 40,
            backgroundColor: "blue",
          }}
          onTouchStart={() =>
            setClicked((clicked) => {
              const clickedCopy = [...clicked];
              clickedCopy[index] = true;
              return clickedCopy;
            })
          }
          onTouchEnd={() =>
            setClicked((clicked) => {
              const clickedCopy = [...clicked];
              clickedCopy[index] = false;
              return clickedCopy;
            })
          }
        ></div>
      ))}
    </div>
  );
};

export default SolvingChallenge;
