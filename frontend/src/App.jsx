// src/App.jsx
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/protected-route';
import RootLayout from './layouts/main-layout';
import AuthLayout from './layouts/auth-layout';
import Login from './pages/login';


function App() {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RootLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<h1>🏠 Hello, this is the home page</h1>} />
        {/* More protected child routes like /dashboard, /profile */}
      </Route>

      {/* Public Routes (No Auth Required) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
