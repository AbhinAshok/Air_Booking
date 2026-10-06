// src/components/dashboard/UserDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Avatar,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  FlightTakeoff,
  MyLocation,
  History,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const response = await bookingService.getUserBookings();

      // Ensure bookings is always an array
      if (response.data && Array.isArray(response.data)) {
        setBookings(response.data);
      } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
        // Handle paginated response
        setBookings(response.data.results);
      } else {
        // If response structure is unexpected, set empty array
        console.warn('Unexpected API response structure:', response.data);
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
      setBookings([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  // Ensure recentBookings is always an array
  const recentBookings = Array.isArray(bookings) ? bookings.slice(0, 3) : [];

  // Helper functions to safely count bookings
  const getTotalTrips = () => Array.isArray(bookings) ? bookings.length : 0;
  const getActiveBookings = () => Array.isArray(bookings) ? bookings.filter(b => b.booking_status === 'confirmed').length : 0;
  const getCompletedPayments = () => Array.isArray(bookings) ? bookings.filter(b => b.payment_status === 'completed').length : 0;
  const getCancelledBookings = () => Array.isArray(bookings) ? bookings.filter(b => b.booking_status === 'cancelled').length : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Section */}
      <Card
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'rgba(255,255,255,0.2)',
                fontSize: '2rem',
              }}
            >
              {getInitials(user?.first_name)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome back, {user?.first_name || 'Traveler'}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Ready for your next adventure?
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              size="large"
              startIcon={<FlightTakeoff />}
              onClick={() => navigate('/flights')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              Book a Flight
            </Button>
          </Grid>
        </Grid>
      </Card>

      {error && (
        <Card sx={{ p: 2, mb: 2, bgcolor: 'error.light' }}>
          <Typography color="error">{error}</Typography>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <MyLocation
              sx={{
                fontSize: 48,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {getTotalTrips()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Trips
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <History
              sx={{
                fontSize: 48,
                color: 'secondary.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {getActiveBookings()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Active Bookings
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <TrendingUp
              sx={{
                fontSize: 48,
                color: 'success.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {getCompletedPayments()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Completed
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <FlightTakeoff
              sx={{
                fontSize: 48,
                color: 'warning.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {getCancelledBookings()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Cancelled
            </Typography>
          </Card>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12}>
          <Card
            sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Recent Bookings
            </Typography>

            {recentBookings.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {recentBookings.map((booking) => (
                  <Card
                    key={booking.id}
                    sx={{
                      p: 2,
                      mb: 2,
                      background: 'rgba(255,255,255,0.5)',
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <Typography variant="h6" fontWeight="bold">
                          {booking.booking_reference}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.flight_details?.flight_number || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body1" fontWeight="medium">
                          {booking.flight_details?.departure_airport || 'Unknown'} → {booking.flight_details?.arrival_airport || 'Unknown'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Chip
                          label={booking.booking_status || 'Unknown'}
                          color={
                            booking.booking_status === 'confirmed' ? 'success' :
                            booking.booking_status === 'cancelled' ? 'error' : 'default'
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="h6" color="primary" textAlign="right">
                          ₹{booking.total_price || '0'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                No bookings yet. Start your journey by booking a flight!
              </Typography>
            )}

            {bookings.length > 3 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/my-trips')}
                >
                  View All Bookings
                </Button>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;