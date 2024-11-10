import React from 'react';
import { Typography, Container } from '@mui/material';

const Dashboard = () => {
  return (
    <Container className='flex items-center justify-center flex-col mt-14'>
      <Typography className='text-4xl font-bolder' variant="h4" gutterBottom>
        Welcome to the Admin Panel
      </Typography>
      <Typography variant="body1 ">
        Here you can manage employees and view statistics.
      </Typography>
    </Container>
  );
};

export default Dashboard;