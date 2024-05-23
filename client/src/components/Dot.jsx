const Dot = ({ pos, dotSize, onTouchStart, onTouchEnd }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `calc(${pos[0]}% - ${dotSize / 2}px)`,
        top: `calc(${pos[1]}% - ${dotSize / 2}px)`,
        height: dotSize,
        width: dotSize,
        backgroundColor: "var(--dot-color)",
        borderRadius: "50%",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    ></div>
  );
};

export default Dot;
