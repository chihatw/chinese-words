import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../layout/AppLayout';

const TopPage = () => {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <h1>Top Page</h1>
      <div>
        <Button onClick={() => navigate('/lists')}>wordLists</Button>
      </div>
      <div>
        <Button onClick={() => navigate('/practice')}>Practice</Button>
      </div>
      <div>
        <Button onClick={() => navigate('/search')}>Search words</Button>
      </div>
    </AppLayout>
  );
};

export default TopPage;
