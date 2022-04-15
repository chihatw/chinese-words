import { Container } from '@mui/material';
import React from 'react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container maxWidth='sm' sx={{ marginTop: 5, marginBottom: 10 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>{children}</div>
    </Container>
  );
};

export default AppLayout;
