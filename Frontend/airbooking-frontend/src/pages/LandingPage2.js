import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  FlightTakeoff,
  Search,
  Security,
  SupportAgent,
  AttachMoney,
  ArrowForward,
  LocationOn,
  CalendarToday,
  Flight,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  // Popular Destinations Data
  const destinations = [
    {
      city: 'Paris',
      country: 'France',
      price: '$450',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    },
    {
      city: 'Tokyo',
      country: 'Japan',
      price: '$820',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
    },
    {
      city: 'New York',
      country: 'USA',
      price: '$320',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    },
    {
      city: 'Dubai',
      country: 'UAE',
      price: '$510',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea904ac66de?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Features Data
  const features = [
    {
      title: 'Best Prices',
      description: 'We compare thousands of airlines to get you the best deals on your flights.',
      icon: <AttachMoney sx={{ fontSize: 32, color: '#2563eb' }} />,
    },
    {
      title: 'Easy Booking',
      description: 'Book your flights in just a few clicks. No hidden fees, no hassle.',
      icon: <FlightTakeoff sx={{ fontSize: 32, color: '#2563eb' }} />,
    },
    {
      title: 'Secure Payments',
      description: 'Your transactions are safe with our state-of-the-art encryption.',
      icon: <Security sx={{ fontSize: 32, color: '#2563eb' }} />,
    },
    {
      title: '24/7 Support',
      description: 'Our dedicated support team is always here to help you with your travel needs.',
      icon: <SupportAgent sx={{ fontSize: 32, color: '#2563eb' }} />,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Navbar (Fixed & Glassmorphic) */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          color: '#1e293b',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <FlightTakeoff sx={{ color: '#2563eb', mr: 1, fontSize: 32 }} />
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: '#1e293b',
              fontWeight: 800,
              letterSpacing: '-0.5px',
            }}
          >
            AirBooking
          </Typography>
          <Button
            component={RouterLink}
            to="/login"
            sx={{ color: '#475569', textTransform: 'none', fontSize: '16px', fontWeight: 600, mr: 2 }}
          >
            Login
          </Button>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            sx={{
              backgroundColor: '#2563eb',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              '&:hover': { backgroundColor: '#1d4ed8' },
            }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* 2. Hero Section with Background Image */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          minHeight: '700px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', mt: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            fontWeight="900"
            gutterBottom
            sx={{ color: '#fff', fontSize: { xs: '2.5rem', md: '4rem' }, letterSpacing: '-1px' }}
          >
            Explore the World <br /> with AirBooking
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 5, color: 'rgba(255,255,255,0.9)', fontWeight: 400, maxWidth: 600, mx: 'auto' }}
          >
            Book your flights easily and securely at the best prices. Your journey starts here.
          </Typography>

          {/* Search Widget */}
          <Paper
            elevation={10}
            sx={{
              p: 2,
              borderRadius: 4,
              maxWidth: 900,
              mx: 'auto',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="From where?"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="To where?"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Flight color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  placeholder="Date"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login')}
                  startIcon={<Search />}
                  sx={{
                    height: '56px',
                    borderRadius: 2,
                    backgroundColor: '#2563eb',
                    '&:hover': { backgroundColor: '#1d4ed8' },
                  }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* 3. Popular Destinations Section */}
      <Box sx={{ py: 10, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h2" fontWeight="800" gutterBottom>
              Popular Destinations
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Find your next adventure among our top-rated destinations.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {destinations.map((dest, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                      '& .MuiCardMedia-root': { transform: 'scale(1.1)' },
                    },
                  }}
                >
                  <Box sx={{ overflow: 'hidden', height: 200 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={dest.image}
                      alt={dest.city}
                      sx={{ transition: 'transform 0.5s ease' }}
                    />
                  </Box>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {dest.city}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {dest.country}
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mt: 2 }}>
                      From {dest.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. Why Choose Us Section */}
      <Box sx={{ py: 10, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h2" fontWeight="800" gutterBottom>
              Why Choose AirBooking?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We make your travel planning effortless and enjoyable.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': { backgroundColor: '#f8fafc', transform: 'translateY(-5px)' },
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      backgroundColor: '#eff6ff',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 5. Call to Action Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight="800" gutterBottom>
            Ready to Take Off?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
            Join thousands of travelers who book their flights with AirBooking every day.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: '#fff',
              color: '#2563eb',
              fontWeight: 'bold',
              py: 1.5,
              px: 5,
              borderRadius: 3,
              '&:hover': { backgroundColor: '#f1f5f9' },
            }}
          >
            Create an Account
          </Button>
        </Container>
      </Box>

      {/* 6. Footer */}
      <Box component="footer" sx={{ py: 6, backgroundColor: '#0f172a', color: '#94a3b8' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FlightTakeoff sx={{ color: '#38bdf8', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  AirBooking
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2, maxWidth: 300 }}>
                Your trusted partner for seamless flight bookings worldwide. Explore, book, and fly with ease.
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#fff' } }}>
                  <Facebook />
                </IconButton>
                <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#fff' } }}>
                  <Twitter />
                </IconButton>
                <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#fff' } }}>
                  <Instagram />
                </IconButton>
                <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#fff' } }}>
                  <LinkedIn />
                </IconButton>
              </Stack>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                Company
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>About Us</Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>Careers</Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>Press</Typography>
              </Stack>
            </Grid>

            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                Support
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>Help Center</Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>Contact Us</Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>FAQs</Typography>
              </Stack>
            </Grid>

            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                Legal
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>Privacy Policy</Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>Terms of Service</Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>Cookie Policy</Typography>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #1e293b', textAlign: 'center' }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} AirBooking. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;