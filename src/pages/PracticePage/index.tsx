import { Button, Container } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import WordListPane from './components/WordListPane';
import WordListsPane from './components/WordListsPane';

const PracticePage = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth='sm' sx={{ marginTop: 5 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <div>
          <h1>Practice</h1>
          <Button onClick={() => navigate('/')}>戻る</Button>
        </div>
        <WordListPane isPractice />
        <WordListsPane />
      </div>
    </Container>
  );
};

export default PracticePage;
