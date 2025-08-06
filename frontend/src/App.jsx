import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './routes/protected-route'
import RootLayout from './layouts/main-layout'
import AuthLayout from './layouts/auth-layout'

import Login from './pages/login'
import Registration from './pages/register'
import Unauthorized from './pages/unauthorized'
import NotFound from './pages/not-found'
import Home from './pages/Home'
import { UserTable } from './pages/user-table'
import SingleUser from './pages/single-user'
import UpdateUsers from './pages/update-user'

function App() {
  return (
    <div className='w-full'>

    <Routes>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>

      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/users" element={<UserTable />} />
        <Route path="/users/:userId" element={<SingleUser />} />
        <Route path="/users/update/:userId" element={<UpdateUsers />} />
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </div>
  )
}

export default App
