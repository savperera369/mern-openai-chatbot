import React from 'react'
import Logo from './shared/Logo'
import { AppBar, Toolbar } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import NavigationLink from './shared/NavigationLink'

const Header = () => {
  const auth = useAuth();

  return (
    <AppBar sx={{
      bgcolor: "transparent",
      boxShadow: "none",
      position: "static"
    }}>
      <Toolbar sx={{
        display: "flex"
      }}>
        <Logo />
        <div>
          {auth?.isLoggedIn ? (
            <>
              <NavigationLink bg="#00fffc" to="/chat" text="Go to Chat" textColor="black"/>
              <NavigationLink bg="#51538f" to="/" text="Log Out" textColor="white" onClick={auth.logout}/>
            </>
          ) : (
            <>
              <NavigationLink bg="#00fffc" to="/login" text="Log In" textColor="black"/>
              <NavigationLink bg="#51538f" to="/signup" text="Sign Up" textColor="white"/>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Header
