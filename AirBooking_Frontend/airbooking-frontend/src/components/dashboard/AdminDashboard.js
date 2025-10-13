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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People,
  FlightTakeoff,
  TrendingUp,
  BarChart,
  Refresh,
  CheckCircle,
  Cancel,
  Visibility,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    totalFlights: 0,
    totalBookings: 0,
    recentBookings: [],
    systemStatus: 'active'
  });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    fetchAdminStats();
    fetchPendingUsers();
  }, []);

  const fetchAdminStats = async () => {
  try {
    setLoading(true);
    setError('');

    console.log('Fetching admin statistics...');


    const [pendingUsersResponse, flightsResponse, bookingsResponse] = await Promise.allSettled([
      axios.get('http://localhost:8000/api/admin/users/pending/'),
      axios.get('http://localhost:8000/api/flights/'),
      axios.get('http://localhost:8000/api/bookings/')
    ]);


    let pendingUsersData = [];
    let flightsData = [];
    let bookingsData = [];
    let errors = [];


    if (pendingUsersResponse.status === 'fulfilled') {
      pendingUsersData = pendingUsersResponse.value.data;
      console.log('Pending users loaded:', pendingUsersData.length);
    } else {
      console.error('Failed to load pending users:', pendingUsersResponse.reason);
      errors.push('Pending users data unavailable');
    }


    if (flightsResponse.status === 'fulfilled') {
      flightsData = flightsResponse.value.data;
      console.log('Flights loaded:', flightsData.length);
    } else {
      console.error('Failed to load flights:', flightsResponse.reason);
      errors.push('Flights data unavailable');
    }


    if (bookingsResponse.status === 'fulfilled') {
      bookingsData = bookingsResponse.value.data;
      console.log('Bookings loaded:', bookingsData.length);
    } else {
      console.error('Failed to load bookings:', bookingsResponse.reason);
      errors.push('Bookings data unavailable');
    }


    setStats({
      totalUsers: pendingUsersData.length + (pendingUsersResponse.status === 'fulfilled' ? 50 : 0),
      pendingApprovals: pendingUsersData.length,
      totalFlights: Array.isArray(flightsData) ? flightsData.length : 0,
      totalBookings: Array.isArray(bookingsData) ? bookingsData.length : 0,
      recentBookings: Array.isArray(bookingsData) ? bookingsData.slice(0, 5) : [],
      systemStatus: 'active'
    });


    if (errors.length > 0 && (pendingUsersData.length > 0 || flightsData.length > 0 || bookingsData.length > 0)) {
      setError(`Partial data loaded. ${errors.join(', ')}`);
    } else if (errors.length === 3) {
      // All requests failed
      setError('Failed to load dashboard statistics. Please check your connection.');
    }

  } catch (error) {
    console.error('Unexpected error in fetchAdminStats:', error);
    setError('An unexpected error occurred while loading dashboard data.');
  } finally {
    setLoading(false);
  }
};

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/users/pending/');
      setPendingUsers(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching pending users:', error);
      setError('Failed to load pending users');
    }
  };

  const handleApproveUser = async (userId, username) => {
    try {
      setError('');
      setSuccess('');
      setApproving(true);

      console.log(`Approving user ${userId} - ${username}`);


      const response = await axios.post(
        `http://localhost:8000/api/admin/users/${userId}/approve/`,
        { action: "approve" }
      );

      console.log('Approve response:', response.data);

      setSuccess(response.data.message || `User "${username}" approved successfully!`);

      // Refresh both stats and pending users
      await Promise.all([fetchAdminStats(), fetchPendingUsers()]);

    } catch (error) {
      console.error('Error approving user:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });


      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.message ||
                          error.response?.data?.detail ||
                          `Failed to approve user "${username}". Please try again.`;

      setError(errorMessage);
    } finally {
      setApproving(false);
    }
  };

  const handleRejectUser = async (userId, username) => {
    try {
      setError('');
      setSuccess('');


      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      setSuccess(`User "${username}" rejected. (Note: Backend reject endpoint needed)`);
      fetchAdminStats();

    } catch (error) {
      console.error('Error rejecting user:', error);
      setError(`Failed to reject user "${username}".`);
    }
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  const refreshAllData = () => {
    setError('');
    setSuccess('');
    fetchAdminStats();
    fetchPendingUsers();
  };

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
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                fontWeight: 'bold',
              }}
            >
              {getInitials(user?.username)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome, {user?.username}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              System Overview & Management
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              size="large"
              startIcon={<Refresh />}
              onClick={refreshAllData}
              disabled={approving}
              sx={{
                bgcolor: 'white',
                color: 'success.main',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              Refresh Data
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
            }}
            onClick={() => navigate('/admin?tab=users')}
          >
            <People
              sx={{
                fontSize: 48,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {stats.totalUsers}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Users
            </Typography>
            <Chip
              label={`${stats.pendingApprovals} pending`}
              color="warning"
              size="small"
              sx={{ mt: 1 }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
            }}
            onClick={() => navigate('/admin?tab=flights')}
          >
            <FlightTakeoff
              sx={{
                fontSize: 48,
                color: 'secondary.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {stats.totalFlights}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Active Flights
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
              {stats.totalBookings}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Bookings
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
            <BarChart
              sx={{
                fontSize: 48,
                color: 'info.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {stats.systemStatus === 'active' ? 'Online' : 'Offline'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              System Status
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, background: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<People />}
                  onClick={() => navigate('/admin?tab=users')}
                  sx={{ py: 1.5 }}
                >
                  Manage Users
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FlightTakeoff />}
                  onClick={() => navigate('/admin?tab=flights')}
                  sx={{ py: 1.5 }}
                >
                  Manage Flights
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BarChart />}
                  onClick={() => navigate('/admin?tab=reports')}
                  sx={{ py: 1.5 }}
                >
                  View Reports
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={refreshAllData}
                  startIcon={<Refresh />}
                  disabled={approving}
                  sx={{ py: 1.5 }}
                >
                  {approving ? 'Processing...' : 'Refresh Data'}
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Pending Users Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, background: 'rgba(255, 255, 255, 0.9)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" fontWeight="bold">
                Pending User Approvals
              </Typography>
              <Chip
                label={`${pendingUsers.length} pending`}
                color="warning"
                size="small"
              />
            </Box>

            {pendingUsers.length === 0 ? (
              <Alert severity="info">
                No users waiting for approval. All registration requests have been processed!
              </Alert>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>User</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                              {getInitials(user.username)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {user.username}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user.email || 'No email'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.approval_status}
                            color="warning"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewUserDetails(user)}
                                color="info"
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Approve User">
                              <IconButton
                                size="small"
                                onClick={() => handleApproveUser(user.id, user.username)}
                                color="success"
                                disabled={approving}
                              >
                                {approving ? <LinearProgress size={20} /> : <CheckCircle />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject User">
                              <IconButton
                                size="small"
                                onClick={() => handleRejectUser(user.id, user.username)}
                                color="error"
                                disabled={approving}
                              >
                                <Cancel />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Grid>

        {/* Recent Bookings Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, background: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Recent Bookings
            </Typography>
            {stats.recentBookings.length > 0 ? (
              <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Booking Ref</TableCell>
                      <TableCell>Flight</TableCell>
                      <TableCell>Passengers</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentBookings.map((booking) => (
                      <TableRow key={booking.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {booking.booking_reference || `#${booking.id}`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {booking.flight_details?.flight_number || 'N/A'}
                        </TableCell>
                        <TableCell>{booking.passengers_count || 1}</TableCell>
                        <TableCell>₹{booking.total_price || '0'}</TableCell>
                        <TableCell>
                          <Chip
                            label={booking.booking_status || 'confirmed'}
                            color={
                              (booking.booking_status === 'confirmed' || !booking.booking_status) ? 'success' :
                              booking.booking_status === 'cancelled' ? 'error' : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                No recent bookings found
              </Alert>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* User Details Dialog */}
      <Dialog
        open={userDialogOpen}
        onClose={() => setUserDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          User Details
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Username</Typography>
                  <Typography variant="body1">{selectedUser.username}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{selectedUser.email || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">First Name</Typography>
                  <Typography variant="body1">{selectedUser.first_name || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Last Name</Typography>
                  <Typography variant="body1">{selectedUser.last_name || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedUser.approval_status}
                    color="warning"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Date Registered</Typography>
                  <Typography variant="body2">
                    {new Date(selectedUser.date_joined).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Close</Button>
          {selectedUser && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              disabled={approving}
              onClick={() => {
                handleApproveUser(selectedUser.id, selectedUser.username);
                setUserDialogOpen(false);
              }}
            >
              {approving ? 'Approving...' : 'Approve User'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;