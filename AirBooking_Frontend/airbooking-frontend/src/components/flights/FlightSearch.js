// src/components/flights/FlightSearch.js
import React, { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Grid,
  Typography,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FlightTakeoff,
  FlightLand,
  CalendarToday,
  People
} from '@mui/icons-material';

const FlightSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    departure_airport: '',
    arrival_airport: '',
    departure_date: '',
    passengers: 1,
  });

  const handleChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format the search parameters
    const formattedParams = {
      ...searchParams,
      departure_airport: searchParams.departure_airport || undefined,
      arrival_airport: searchParams.arrival_airport || undefined,
      departure_date: searchParams.departure_date || undefined,
    };

    onSearch(formattedParams);
  };

  return (
    <Card
      sx={{
        p: 3,
        mb: 4,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        Find Your Perfect Flight
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Search and book flights to your favorite destinations
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="From (e.g., DEL)"
              value={searchParams.departure_airport}
              onChange={(e) => handleChange('departure_airport', e.target.value)}
              placeholder="Departure airport code"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlightTakeoff color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="To (e.g., BOM)"
              value={searchParams.arrival_airport}
              onChange={(e) => handleChange('arrival_airport', e.target.value)}
              placeholder="Arrival airport code"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlightLand color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Departure Date"
              type="date"
              value={searchParams.departure_date}
              onChange={(e) => handleChange('departure_date', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Passengers"
              type="number"
              value={searchParams.passengers}
              onChange={(e) => handleChange('passengers', parseInt(e.target.value) || 1)}
              InputProps={{
                inputProps: { min: 1, max: 10 },
                startAdornment: (
                  <InputAdornment position="start">
                    <People color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Search />}
              sx={{ py: 1.5 }}
            >
              Search Flights
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default FlightSearch;