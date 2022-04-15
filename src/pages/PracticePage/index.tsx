import { Button, Container } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../layout/AppLayout';
import WordListPane from './components/WordListPane';
import WordListsPane from './components/WordListsPane';

const PracticePage = () => {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <div>
        <h1>Practice</h1>
        <Button onClick={() => navigate('/')}>戻る</Button>
      </div>
      <WordListPane isPractice />
      <WordListsPane />
    </AppLayout>
  );
};

export default PracticePage;
