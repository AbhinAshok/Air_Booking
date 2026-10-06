// src/pages/FlightsPage.js
import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import FlightSearch from '../components/flights/FlightSearch';
import FlightList from '../components/flights/FlightList';
import BookingModal from '../components/bookings/BookingModal';
import Layout from '../components/common/Layout';
import { flightService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const FlightsPage = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSearch = async (searchParams) => {
    setLoading(true);
    try {
      const response = await flightService.searchFlights(searchParams);

      // Handle different response structures
      let flightsData = [];
      if (response.data && Array.isArray(response.data)) {
        flightsData = response.data;
      } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
        flightsData = response.data.results;
      } else {
        console.warn('Unexpected flights API response structure:', response.data);
        flightsData = [];
      }

      setFlights(flightsData);
    } catch (error) {
      console.error('Error searching flights:', error);
      setSnackbar({
        open: true,
        message: 'Error searching flights. Please try again.',
        severity: 'error',
      });
      setFlights([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (flight) => {
    setSelectedFlight(flight);
    setBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setBookingModalOpen(false);
    setSnackbar({
      open: true,
      message: 'Booking created successfully!',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="white">
            Book Your Flight
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.8)">
            Discover amazing destinations at great prices
          </Typography>
        </Box>

        <FlightSearch onSearch={handleSearch} />

        {loading ? (
          <LoadingSpinner message="Searching for flights..." />
        ) : (
          <FlightList flights={flights} onBook={handleBook} />
        )}

        <BookingModal
          open={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          flight={selectedFlight}
          onSuccess={handleBookingSuccess}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default FlightsPage;