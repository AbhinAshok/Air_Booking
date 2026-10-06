
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  Schedule,
  Person,
  Close,
} from '@mui/icons-material';
import { format } from 'date-fns';

const BookingDetailsModal = ({ open, onClose, booking }) => {
  if (!booking) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'EEE, MMM dd, yyyy HH:mm');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Booking Details</Typography>
          <Button onClick={onClose} size="small">
            <Close />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Booking Reference
          </Typography>
          <Typography variant="h6" gutterBottom>
            {booking.booking_reference || `#${booking.id}`}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Flight Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <FlightTakeoff color="primary" />
                <Typography>
                  {booking.flight_details?.flight_number} - {booking.flight_details?.airline}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Route
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body1">
                  {booking.flight_details?.departure_airport}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  ↓
                </Typography>
                <Typography variant="body1">
                  {booking.flight_details?.arrival_airport}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Departure Time
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Schedule color="primary" />
                <Typography>
                  {formatDate(booking.flight_details?.departure_time)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Passengers
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Person color="primary" />
                <Typography>
                  {booking.passengers_count} passenger(s)
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Price
            </Typography>
            <Typography variant="h6" color="primary">
              ₹{booking.total_price}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={booking.booking_status}
              color={booking.booking_status === 'confirmed' ? 'success' : 'default'}
              sx={{ mt: 0.5 }}
            />
          </Grid>
        </Grid>

        {booking.special_requests && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Special Requests
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {booking.special_requests}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDetailsModal;