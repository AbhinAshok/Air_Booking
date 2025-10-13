// src/pages/MyTripsPage.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Alert,
  Button,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { FlightTakeoff, Refresh, Login } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyTripsPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    if (!isAuthenticated) {
      setError('Please log in to view your bookings');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('🔄 Fetching bookings with token:', !!localStorage.getItem('token'));

      const response = await axios.get('http://localhost:8000/api/bookings/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('✅ Bookings fetched successfully:', response.data);

      let bookingsData = [];
      if (Array.isArray(response.data)) {
        bookingsData = response.data;
      } else if (response.data && typeof response.data === 'object') {
        bookingsData = response.data.results || response.data.bookings || response.data.data || [];
      }

      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);

      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        logout();
      } else {
        setError(error.response?.data?.detail || 'Failed to load bookings. Please try again.');
      }
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  const handleRetry = () => {
    fetchBookings();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <FlightTakeoff sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="text.secondary">
              Authentication Required
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Please log in to view your bookings.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Login />}
              onClick={handleLoginRedirect}
              size="large"
            >
              Log In
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            My Trips
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.username || 'User'}!
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Refresh />} onClick={handleRetry}>
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {bookings.length === 0 && !error ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <FlightTakeoff sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="text.secondary">
              No Bookings Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You haven't made any bookings yet.
            </Typography>
            <Button variant="contained" onClick={() => window.location.href = '/flights'}>
              Book a Flight
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell><strong>Booking Reference</strong></TableCell>
                <TableCell><strong>Flight</strong></TableCell>
                <TableCell><strong>Route</strong></TableCell>
                <TableCell><strong>Departure</strong></TableCell>
                <TableCell><strong>Passengers</strong></TableCell>
                <TableCell><strong>Total Price</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {booking.booking_reference || `#${booking.id}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {booking.flight_details?.flight_number || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {booking.flight_details?.airline || ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.flight_details?.departure_airport?.split(' - ')[0] || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      → {booking.flight_details?.arrival_airport?.split(' - ')[0] || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(booking.flight_details?.departure_time)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.passengers_count}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      ₹{booking.total_price}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.booking_status || 'confirmed'}
                      color={booking.booking_status === 'confirmed' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MyTripsPage;
