// src/pages/AdminPage.js
import React from 'react';
import { Container } from '@mui/material';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import Layout from '../components/common/Layout';
import { useAuth } from '../contexts/AuthContext';

const AdminPage = () => {
  const { isAdmin } = useAuth();

  return (
    <Layout>
      <Container maxWidth="xl">
        <AdminDashboard />
      </Container>
    </Layout>
  );
};

export default AdminPage;