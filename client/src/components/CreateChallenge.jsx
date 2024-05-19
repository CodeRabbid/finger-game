import { useRef, useState } from "react";

const CreateChallenge = ({ pos, setPos }) => {
  const ref = useRef();
  return (
    <div
      style={{
        position: "relative",
        height: 300,
        width: "100%",
        backgroundColor: "yellow",
      }}
      ref={ref}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        setPos((pos) => {
          const posCopy = [...pos];
          posCopy.push([
            (touch.pageX / ref.current.offsetWidth) * 100,
            (touch.pageY / ref.current.offsetHeight) * 100,
          ]);
          return posCopy;
        });
      }}
    >
      {pos.map((p, index) => (
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
        ></div>
      ))}
    </div>
  );
};

export default CreateChallenge;
