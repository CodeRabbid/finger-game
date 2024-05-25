import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  return localStorage.getItem("access_token") ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};
export default PrivateRoute;
