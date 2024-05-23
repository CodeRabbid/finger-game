const Dot = ({ pos, onTouchStart, onTouchEnd }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `calc(${pos[0]}% - 30px)`,
        top: `calc(${pos[1]}% - 30px)`,
        height: 60,
        width: 60,
        backgroundColor: "var(--dot-color)",
        borderRadius: "50%",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    ></div>
  );
};

export default Dot;
