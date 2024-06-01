import { useState } from "react";

const Dot = ({ pos = [0, 0], dotSize, onTouchStart, onTouchEnd }) => {
  const [dotColor, setDotColor] = useState("var(--dot-color)");
  return (
    <div
      style={{
        position: "absolute",
        left: `calc(${pos[0]}% - ${dotSize / 2}px)`,
        top: `calc(${pos[1]}% - ${dotSize / 2}px)`,
        height: dotSize,
        width: dotSize,
        backgroundColor: dotColor,
        borderRadius: "50%",
      }}
      onTouchStart={() => {
        setDotColor("blue");
        onTouchStart();
      }}
      onTouchEnd={() => {
        setDotColor("var(--dot-color)");
        onTouchEnd();
      }}
    ></div>
  );
};

export default Dot;
