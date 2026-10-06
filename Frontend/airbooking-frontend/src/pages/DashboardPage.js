// src/pages/DashboardPage.js
import React from 'react';
import { Container } from '@mui/material';
import UserDashboard from '../components/dashboard/UserDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import Layout from '../components/common/Layout';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();

  return (
    <Layout>
      <Container maxWidth="xl">
        {isAdmin ? <AdminDashboard /> : <UserDashboard />}
      </Container>
    </Layout>
  );
};

export default DashboardPage;