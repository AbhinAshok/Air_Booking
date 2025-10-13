// src/components/flights/FlightList.js
import React from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  Schedule,
  AttachMoney,
  AirlineSeatReclineNormal,
} from '@mui/icons-material';
import { format } from 'date-fns';

const FlightList = ({ flights, onBook }) => {
  // Ensure flights is always an array
  const flightsArray = Array.isArray(flights) ? flights : [];

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'default',
      on_time: 'success',
      delayed: 'warning',
      cancelled: 'error',
      departed: 'info',
      arrived: 'primary',
    };
    return colors[status] || 'default';
  };

  const formatTime = (dateTime) => {
    try {
      return format(new Date(dateTime), 'HH:mm');
    } catch (error) {
      return 'Invalid time';
    }
  };

  const formatDate = (dateTime) => {
    try {
      return format(new Date(dateTime), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!Array.isArray(flights)) {
    return (
      <Card
        sx={{
          p: 4,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Alert severity="warning">
          Unexpected data format received from server
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please try searching again
        </Typography>
      </Card>
    );
  }

  if (flightsArray.length === 0) {
    return (
      <Card
        sx={{
          p: 4,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No flights found matching your criteria
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your search parameters
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {flightsArray.map((flight) => (
        <Card
          key={flight.id}
          sx={{
            p: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            },
          }}
        >
          <Grid container spacing={3} alignItems="center">
            {/* Flight Info */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {flight.flight_number || 'N/A'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {flight.airline || 'Unknown Airline'}
                </Typography>
                <Chip
                  label={(flight.status || 'scheduled').replace('_', ' ').toUpperCase()}
                  color={getStatusColor(flight.status)}
                  size="small"
                />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <FlightTakeoff color="primary" sx={{ mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      {formatTime(flight.departure_time)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flight.departure_airport || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(flight.departure_time)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Schedule color="action" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {/* Calculate duration would be implemented */}
                      2h 30m
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <FlightLand color="primary" sx={{ mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      {formatTime(flight.arrival_time)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flight.arrival_airport || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(flight.arrival_time)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={1}>
              <Divider orientation="vertical" flexItem />
            </Grid>

            {/* Price and Action */}
            <Grid item xs={12} md={5}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                  <AirlineSeatReclineNormal color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {flight.available_seats || 0} seats left
                  </Typography>
                </Box>

                <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
                  ₹{flight.price || 0}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => onBook(flight)}
                  disabled={!flight.available_seats || flight.available_seats === 0}
                  sx={{ py: 1.5 }}
                >
                  {!flight.available_seats || flight.available_seats === 0 ? 'No Seats' : 'Book Now'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      ))}
    </Box>
  );
};

export default FlightList;