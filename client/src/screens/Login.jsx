import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(1);
  const [registering, setRegistering] = useState(false);

  const register = async () => {
    if (password !== repassword) {
      setErrorMessage("passwords don't macht");
    } else {
      try {
        const { data } = await axios.post("/api/register", {
          username,
          password,
        });
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("username", data.username);
        setLoggedIn(2);
      } catch (err) {
        console.log(err);
        setErrorMessage(err.message);
      }
    }
  };

  const login = async () => {
    try {
      const { data } = await axios.post("/api/login", {
        username,
        password,
      });
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("username", data.username);
      setLoggedIn(2);
    } catch (err) {
      console.log(err);
      setErrorMessage(err.message);
    }
  };
  return (
    <>
      {loggedIn >= 1 && localStorage.getItem("access_token") ? (
        <Navigate to={"/"} />
      ) : (
        <>
          <div className="center-container-1">
            <div className="center-container-2">
              <div className="centered-content">
                <TextField
                  type="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  style={{
                    backgroundColor: "#fcfaae",
                  }}
                  color="warning"
                  placeholder="Name"
                  onFocus={() => setErrorMessage("")}
                />
              </div>
              <div className="centered-content">
                <TextField
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  style={{
                    backgroundColor: "#fcfaae",
                  }}
                  color="warning"
                  placeholder="Password"
                  onFocus={() => setErrorMessage("")}
                />
              </div>

              {registering ? (
                <>
                  <div className="centered-content">
                    <TextField
                      type="password"
                      value={repassword}
                      onChange={(e) => {
                        setRepassword(e.target.value);
                      }}
                      color="warning"
                      variant="outlined"
                      style={{
                        backgroundColor: "#fcfaae",
                      }}
                      placeholder="Retype Password"
                      onFocus={() => setErrorMessage("")}
                    />
                  </div>

                  <div
                    className="centered-content"
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginBottom: "5px",
                    }}
                  >
                    {" "}
                    {errorMessage}
                  </div>
                  <div className="centered-content">
                    <Button
                      variant="contained"
                      style={{
                        height: 56,
                        width: 195,
                        backgroundColor: "orange",
                        color: "white",
                      }}
                      onClick={register}
                    >
                      Register
                    </Button>
                  </div>
                  <div className="centered-content">
                    <Button
                      onClick={() => setRegistering(false)}
                      style={{
                        color: "orange",
                        height: 56,
                      }}
                    >
                      Already have an account? - Login!
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="centered-content"
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginBottom: "5px",
                    }}
                  >
                    {" "}
                    {errorMessage}
                  </div>
                  <div className="centered-content">
                    <Button
                      variant="contained"
                      style={{
                        height: 56,
                        width: 195,
                        backgroundColor: "orange",
                        color: "white",
                      }}
                      onClick={login}
                    >
                      Login
                    </Button>
                  </div>

                  <div className="centered-content">
                    <Button
                      style={{
                        color: "orange",
                        height: 56,
                      }}
                      onClick={() => setRegistering(true)}
                    >
                      Don't have an account? - Register!
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
