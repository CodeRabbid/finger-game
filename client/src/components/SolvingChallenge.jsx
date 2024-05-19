const SolvingChallenge = ({ initialPos, challengeSolved }) => {
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
          onTouchStart={() => challengeSolved()}
        ></div>
      ))}
    </div>
  );
};

export default SolvingChallenge;
