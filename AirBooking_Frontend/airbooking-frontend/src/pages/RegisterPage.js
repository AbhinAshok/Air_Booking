
import React from 'react';
import { Container } from '@mui/material';
import Register from '../components/auth/Register';
import Layout from '../components/common/Layout';

const RegisterPage = () => {
  return (
    <Layout>
      <Container maxWidth="lg">
        <Register />
      </Container>
    </Layout>
  );
};

export default RegisterPage;