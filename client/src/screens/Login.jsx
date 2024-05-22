import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("No error message");
  const [loggedIn, setLoggedIn] = useState(1);

  const register = async () => {
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
      console.log(setErrorMessage(err.message));
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
      console.log(setErrorMessage(err.message));
    }
  };
  return (
    <>
      {loggedIn >= 1 && localStorage.getItem("access_token") ? (
        <Navigate to={"/"} />
      ) : (
        <>
          <div>
            <input
              type="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="Name"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
            />
          </div>
          <div>
            <input
              type="password"
              value={repassword}
              onChange={(e) => {
                setRepassword(e.target.value);
              }}
              placeholder="Retype Password"
            />
          </div>
          <div>
            <button onClick={register}>Register</button>
          </div>
          <div>{errorMessage}</div>
          <div>
            <button onClick={login}>Login</button>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
