import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App.jsx";
import Login from "./screens/Login.jsx";
import SelectGame from "./screens/GameMain.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import "./index.css";
import { SocketProvider } from "./context/SocketContext.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<PrivateRoute />}>
        <Route index={true} path="/" element={<SelectGame />} />
      </Route>
      <Route index={true} path="/login" element={<Login />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <RouterProvider router={router} />{" "}
  </SocketProvider>
);
