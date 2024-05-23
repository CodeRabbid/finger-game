const Dot = ({ pos }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `calc(${pos[0]}% - 30px)`,
        top: `calc(${pos[1]}% - 30px)`,
        height: 60,
        width: 60,
        backgroundColor: "#ff4545",
        borderRadius: "50%",
      }}
    ></div>
  );
};

export default Dot;
