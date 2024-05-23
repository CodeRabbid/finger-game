import { useRef, useState } from "react";
import Dot from "./Dot";

const CreateChallenge = ({ pos, setPos }) => {
  const ref = useRef();

  const handleDoTPlacement = (e) => {
    const touch = e.touches[0];
    const newPixelPosX = touch.pageX;
    const newPixelPosY = touch.pageY;
    let legit = true;
    for (const p of pos) {
      const pPixelPosX = (p[0] * ref.current.offsetWidth) / 100;
      const pPixelPosY = (p[1] * ref.current.offsetHeight) / 100;
      const a = newPixelPosX - pPixelPosX;
      const b = newPixelPosY - pPixelPosY;
      const c = Math.sqrt(a * a + b * b);
      if (c <= 60) legit = false;
      console.log(c);
      console.log(legit);
    }
    if (legit) {
      setPos((pos) => {
        const posCopy = [...pos];
        posCopy.push([
          (touch.pageX / ref.current.offsetWidth) * 100,
          (touch.pageY / ref.current.offsetHeight) * 100,
        ]);
        return posCopy;
      });
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
      }}
      ref={ref}
      onTouchStart={handleDoTPlacement}
    >
      {pos.map((p, index) => (
        <Dot pos={p} key={index} />
      ))}
    </div>
  );
};

export default CreateChallenge;
