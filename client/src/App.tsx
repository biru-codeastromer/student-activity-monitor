import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Activities from './pages/Activities'
import Resources from './pages/Resources'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/resources" element={<Resources />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
