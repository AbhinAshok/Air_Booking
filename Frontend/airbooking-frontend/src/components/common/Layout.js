
import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { FlightTakeoff, Logout, Person } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      <AppBar
        position="static"
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Toolbar>
          <FlightTakeoff sx={{ mr: 2, color: 'white' }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              color: 'white',
              fontWeight: 700,
              fontSize: '1.5rem',
            }}
          >
            AirBooking
          </Typography>

          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                color="inherit"
                startIcon={<Person />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  backgroundColor: isActive('/dashboard') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/flights')}
                sx={{
                  backgroundColor: isActive('/flights') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Search Flights
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/my-trips')}
                sx={{
                  backgroundColor: isActive('/my-trips') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                My Trips
              </Button>
              {user?.is_staff && (
                <Button
                  color="inherit"
                  onClick={() => navigate('/admin')}
                  sx={{
                    backgroundColor: isActive('/admin') ? 'rgba(255,255,255,0.2)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Admin
                </Button>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Hello, {user?.first_name || user?.username}
                </Typography>
                <Button
                  color="inherit"
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  sx={{
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white',
                  },
                }}
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;