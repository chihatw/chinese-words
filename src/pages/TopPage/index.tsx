import { Button, Container } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopPage = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth='sm' sx={{ marginTop: 5 }}>
      <div style={{ display: 'grid' }}>
        <h1>Top Page</h1>
        <div>
          <Button onClick={() => navigate('/lists')}>wordLists</Button>
        </div>
        <div>
          <Button onClick={() => navigate('/practice')}>Practice</Button>
        </div>
        <div>
          <Button onClick={() => navigate('/search')}>Search word</Button>
        </div>
      </div>
    </Container>
  );
};

export default TopPage;
