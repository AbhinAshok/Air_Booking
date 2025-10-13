import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Card,
  Grid,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  Person,
  Payment,
  CheckCircle,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { bookingService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const BookingModal = ({ open, onClose, flight, onBookingSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const steps = ['Flight Details', 'Passenger Info', 'Confirmation'];

  const handleBookFlight = async () => {
    if (!flight) return;

    setLoading(true);
    setError('');

    try {
      const bookingData = {
        flight: flight.id,
        passengers_count: passengers,
        special_requests: '',
      };

      const response = await bookingService.createBooking(bookingData);

      setSuccess(true);

      // Call the success callback after a delay
      setTimeout(() => {
        if (onBookingSuccess) {
          onBookingSuccess(response.data);
        }
        handleClose();
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.detail || error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setPassengers(1);
    setError('');
    setSuccess(false);
    onClose();
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleBookFlight();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Flight Details
            </Typography>
            <Card sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FlightTakeoff color="primary" />
                    <Typography variant="body1" fontWeight="bold">
                      Departure
                    </Typography>
                  </Box>
                  <Typography variant="h6">
                    {flight.departure_airport.split(' - ')[0]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(flight.departure_time), 'EEE, MMM dd, yyyy')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(flight.departure_time), 'HH:mm')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FlightLand color="primary" />
                    <Typography variant="body1" fontWeight="bold">
                      Arrival
                    </Typography>
                  </Box>
                  <Typography variant="h6">
                    {flight.arrival_airport.split(' - ')[0]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(flight.arrival_time), 'EEE, MMM dd, yyyy')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(flight.arrival_time), 'HH:mm')}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">
                  <strong>Flight:</strong> {flight.flight_number} • {flight.airline}
                </Typography>
                <Typography variant="h6" color="primary">
                  ₹{flight.price} per person
                </Typography>
              </Box>
            </Card>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Passenger Information
            </Typography>
            <Card sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Person color="primary" />
                <Typography variant="body1" fontWeight="bold">
                  Number of Passengers
                </Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                inputProps={{ min: 1, max: flight.available_seats }}
                helperText={`Maximum ${flight.available_seats} seats available`}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Booking for: {user?.first_name} {user?.last_name}
              </Typography>
            </Card>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="h5" color="primary">
                Total: ₹{flight.price * passengers}
              </Typography>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Booking
            </Typography>
            <Card sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Payment color="primary" />
                <Typography variant="body1" fontWeight="bold">
                  Booking Summary
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Flight:
                  </Typography>
                  <Typography variant="body1">
                    {flight.flight_number} - {flight.airline}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Route:
                  </Typography>
                  <Typography variant="body1">
                    {flight.departure_airport.split(' - ')[0]} → {flight.arrival_airport.split(' - ')[0]}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Passengers:
                  </Typography>
                  <Typography variant="body1">
                    {passengers}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount:
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ₹{flight.price * passengers}
                  </Typography>
                </Grid>
              </Grid>

              <Alert severity="info">
                Click "Confirm Booking" to complete your reservation.
              </Alert>
            </Card>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  if (!flight) return null;

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 600 },
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
            Book Flight
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom color="success.main">
                Booking Confirmed!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your flight has been successfully booked. Redirecting...
              </Typography>
            </Box>
          ) : (
            getStepContent(activeStep)
          )}

          {!success && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
              >
                Back
              </Button>
              <Box>
                <Button onClick={handleClose} sx={{ mr: 1 }} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading || passengers > flight.available_seats}
                >
                  {loading ? 'Processing...' :
                  activeStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Booking confirmed successfully!"
      />
    </>
  );
};

export default BookingModal;