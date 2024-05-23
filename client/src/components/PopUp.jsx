import { Button } from "@mui/material";

const PopUp = ({ onDecline, onAccept, text }) => {
  return (
    <div className="center-container-1">
      <div className="center-container-2">
        <div className="centered-content">
          <div
            style={{
              display: "inline-block",
              //   maxWidth: "200px",
              //   minWidth: "200px",
              minHeight: "100px",
              backgroundColor: "var(--light-background)",
              textAlign: "center",
              borderColor: "orange",
              borderStyle: "solid",
              borderRadius: 5,
              borderWidth: "3px",
              fontSize: "20px",
              padding: "10px 10px 10px 10px",
            }}
          >
            <p style={{ fontFamily: "Arial, sans-serif", color: "orange" }}>
              {text}
            </p>
            <div
              style={{
                display: "inline-block",
              }}
            >
              <Button
                style={{
                  height: 50,
                  width: 100,
                  display: "inline-block",
                  margin: "0px 7px 7px 10px",
                  padding: "7px 7px 7px 7px",
                  color: "orange",
                  borderStyle: "solid",
                  borderColor: "orange",
                  borderWidth: "2px",
                }}
                onClick={() => onDecline()}
              >
                decline
              </Button>
              <Button
                variant="contained"
                style={{
                  height: 50,
                  width: 100,
                  display: "inline-block",
                  margin: "0px 7px 7px 10px",
                  padding: "7px 7px 7px 7px",
                  backgroundColor: "orange",
                  color: "white",
                  borderStyle: "solid",
                  borderColor: "orange",
                  borderWidth: "2px",
                }}
                onClick={() => onAccept()}
              >
                accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
