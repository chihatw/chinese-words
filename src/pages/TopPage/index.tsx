import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../layout/AppLayout';

const TopPage = () => {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <h1>Top Page</h1>

      <Button
        onClick={() => navigate('/practice')}
        sx={{ justifyContent: 'flex-start' }}
      >
        Practice
      </Button>

      <Button
        onClick={() => navigate('/lists')}
        sx={{ justifyContent: 'flex-start' }}
      >
        Lists
      </Button>

      <Button
        onClick={() => navigate('/search')}
        sx={{ justifyContent: 'flex-start' }}
      >
        Search
      </Button>
      <Button
        onClick={() => navigate('/character')}
        sx={{ justifyContent: 'flex-start' }}
      >
        Character
      </Button>
    </AppLayout>
  );
};

export default TopPage;
