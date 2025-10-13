
import React from 'react';
import { Container } from '@mui/material';
import Login from '../components/auth/Login';
import Layout from '../components/common/Layout';

const LoginPage = () => {
  return (
    <Layout>
      <Container maxWidth="lg">
        <Login />
      </Container>
    </Layout>
  );
};

export default LoginPage;