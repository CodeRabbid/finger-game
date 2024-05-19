import { useEffect, useState } from "react";

const SolvingChallenge = ({ initialPos, challengeSolved }) => {
  const [clicked, setClicked] = useState([false, false]);

  useEffect(() => {
    if (clicked[0] && clicked[1]) challengeSolved();
  }, [clicked]);

  return (
    <div
      style={{
        position: "relative",
        height: 300,
        width: "100%",
        backgroundColor: "yellow",
      }}
    >
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
