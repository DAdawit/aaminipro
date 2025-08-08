import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/protected-route";
import RootLayout from "./layouts/main-layout";
import AuthLayout from "./layouts/auth-layout";

import Login from "./pages/login";
import Registration from "./pages/register";
import Unauthorized from "./pages/unauthorized";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import ReachEditor from "./components/ReachEditor";
import Editor2 from "./components/Editor2";
import SocketComponent from "./components/SocketComponent";

function App() {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
        <Route element={<RootLayout />}>
          <Route path="/dashboard" element={<Home />} />
        </Route>
      </Route>

      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        {/* <Route path="/test" element={<Editor2 />} /> */}
        <Route path="/test" element={<SocketComponent />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
