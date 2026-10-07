import React from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowForward,
  CheckCircle,
  Flight,
  FlightTakeoff,
  Luggage,
  Payments,
  Public,
  Security,
  Search,
  AccessTime,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LandingPage.css';

const features = [
  {
    icon: <Search />,
    title: 'Find the right flight',
    text: 'Search available flights by route, date and passenger count in seconds.',
  },
  {
    icon: <Payments />,
    title: 'Simple booking',
    text: 'Review your itinerary, choose your seats and complete your booking with confidence.',
  },
  {
    icon: <Luggage />,
    title: 'Trips in one place',
    text: 'Keep upcoming and previous bookings organized from your personal dashboard.',
  },
];

const destinations = [
  { code: 'DXB', city: 'Dubai', country: 'United Arab Emirates', accent: 'sunset' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', accent: 'sky' },
  { code: 'LHR', city: 'London', country: 'United Kingdom', accent: 'night' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const startBooking = () => navigate(isAuthenticated ? '/flights' : '/register');

  return (
    <Box className="landing-page">
      <Box className="landing-nav">
        <Container maxWidth="lg">
          <Box className="landing-nav-inner">
            <Button className="brand" onClick={() => navigate('/')}>
              <Box className="brand-icon"><FlightTakeoff /></Box>
              <Box>
                <Typography className="brand-name">AirBooking</Typography>
                <Typography className="brand-tagline">Travel, made simple.</Typography>
              </Box>
            </Button>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Button className="nav-link" onClick={() => navigate('/login')}>Log in</Button>
              <Button className="nav-cta" onClick={() => navigate('/register')}>Create account</Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box className="hero-section">
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 3 }} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip icon={<Public />} label="Your next journey starts here" className="hero-chip" />
              <Typography component="h1" className="hero-title">
                Fly farther.
                <br />
                <span>Travel smarter.</span>
              </Typography>
              <Typography className="hero-copy">
                Discover flights, compare options and book your next trip in a few simple steps.
                AirBooking keeps your entire journey clear and organized from search to takeoff.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="hero-actions">
                <Button className="primary-action" endIcon={<ArrowForward />} onClick={startBooking}>
                  {isAuthenticated ? 'Search flights' : 'Get started'}
                </Button>
                {!isAuthenticated && (
                  <Button className="secondary-action" onClick={() => navigate('/login')}>
                    I already have an account
                  </Button>
                )}
              </Stack>
              <Stack direction="row" spacing={3} flexWrap="wrap" className="trust-row">
                <Box><CheckCircle /> Secure booking</Box>
                <Box><CheckCircle /> Real-time availability</Box>
                <Box><CheckCircle /> Easy trip management</Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box className="hero-visual">
                <Box className="glow glow-one" />
                <Box className="glow glow-two" />
                <Paper className="flight-card">
                  <Box className="flight-card-top">
                    <Box>
                      <Typography className="eyebrow">NEXT ADVENTURE</Typography>
                      <Typography className="flight-route">COK <span>✈</span> DXB</Typography>
                    </Box>
                    <Chip label="Ready to fly" className="ready-chip" />
                  </Box>
                  <Box className="route-line"><span /><Box className="plane-dot"><Flight /></Box><span /></Box>
                  <Stack direction="row" justifyContent="space-between" className="flight-meta">
                    <Box><strong>Kochi</strong><small>COK • 08:40</small></Box>
                    <Box className="meta-right"><strong>Dubai</strong><small>DXB • 11:20</small></Box>
                  </Stack>
                  <Box className="card-divider" />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box><Typography className="small-label">From</Typography><Typography className="price">₹12,499</Typography></Box>
                    <Button className="mini-button" onClick={startBooking}>View flights</Button>
                  </Stack>
                </Paper>
                <Box className="floating-stat stat-top"><Security /><Box><strong>Secure</strong><small>Protected booking</small></Box></Box>
                <Box className="floating-stat stat-bottom"><AccessTime /><Box><strong>Quick search</strong><small>Find your flight fast</small></Box></Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box className="stats-strip">
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {[
              ['24/7', 'Travel planning'],
              ['3 steps', 'Simple booking'],
              ['1 place', 'Manage every trip'],
              ['100%', 'Booking visibility'],
            ].map(([value, label]) => (
              <Grid item xs={6} md={3} key={label}>
                <Box className="stat-item"><strong>{value}</strong><span>{label}</span></Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box className="content-section">
        <Container maxWidth="lg">
          <Box className="section-heading">
            <Typography className="section-kicker">WHY AIRBOOKING</Typography>
            <Typography component="h2">Everything you need to book with confidence.</Typography>
            <Typography>Designed to make flight search and trip management feel effortless.</Typography>
          </Box>
          <Grid container spacing={2.5}>
            {features.map((feature) => (
              <Grid item xs={12} md={4} key={feature.title}>
                <Paper className="feature-card">
                  <Box className="feature-icon">{feature.icon}</Box>
                  <Typography component="h3">{feature.title}</Typography>
                  <Typography>{feature.text}</Typography>
                  <Box className="feature-arrow"><ArrowForward /></Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box className="destination-section">
        <Container maxWidth="lg">
          <Box className="section-heading destination-heading">
            <Box>
              <Typography className="section-kicker">GO SOMEWHERE NEW</Typography>
              <Typography component="h2">Popular routes to inspire your next trip.</Typography>
            </Box>
            <Button className="outline-action" endIcon={<ArrowForward />} onClick={startBooking}>Explore flights</Button>
          </Box>
          <Grid container spacing={2.5}>
            {destinations.map((destination) => (
              <Grid item xs={12} md={4} key={destination.code}>
                <Paper className={`destination-card ${destination.accent}`}>
                  <Box className="destination-code">{destination.code}</Box>
                  <Box>
                    <Typography component="h3">{destination.city}</Typography>
                    <Typography>{destination.country}</Typography>
                  </Box>
                  <FlightTakeoff className="destination-plane" />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box className="final-cta">
        <Container maxWidth="md">
          <Box className="final-cta-inner">
            <Flight className="cta-plane" />
            <Typography component="h2">Ready for your next adventure?</Typography>
            <Typography>Search available flights and make your next journey one less thing to worry about.</Typography>
            <Button className="primary-action" endIcon={<ArrowForward />} onClick={startBooking}>
              {isAuthenticated ? 'Search flights' : 'Start booking'}
            </Button>
          </Box>
        </Container>
      </Box>

      <Box component="footer" className="landing-footer">
        <Container maxWidth="lg">
          <Box className="footer-inner">
            <Box className="footer-brand"><FlightTakeoff /><strong>AirBooking</strong></Box>
            <Typography>© {new Date().getFullYear()} AirBooking. Built for smoother journeys.</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
