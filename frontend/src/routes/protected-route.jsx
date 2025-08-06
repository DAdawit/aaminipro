// src/router/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import useUser from '../hooks/use-user';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useUser();
  console.log(user)
  // if not login
  if (!isAuthenticated) {
    console.log(isAuthenticated,'isauthenticated')
    return <Navigate to="/login" replace />;
  }
  // if the role is not found in allowed roles.
  // if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }
  // if legal
  return <Outlet />;
};

export default ProtectedRoute;
