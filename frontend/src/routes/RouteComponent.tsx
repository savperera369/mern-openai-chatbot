import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Chat from '../pages/Chat'
import NotFound from '../pages/NotFound'
import { useAuth } from '../context/AuthContext'

const RouteComponent = () => {
  const auth = useAuth();

  return (
    <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {auth?.isLoggedIn && auth.user && (<Route path="/chat" element={<Chat />} />)}
        <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default RouteComponent
