import { Button, Container } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import WordRow from '../../components/WordRow';
import { AppContext } from '../../services/context';
import WordListsPane from './components/WordListsPane';

const PracticePage = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth='sm' sx={{ marginTop: 5 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <h1>Practice</h1>
        <div>
          <Button onClick={() => navigate('/')}>戻る</Button>
        </div>
        <WordListPane />
        <WordListsPane />
      </div>
    </Container>
  );
};

export default PracticePage;

const WordListPane = () => {
  const { words, wordList } = useContext(AppContext);
  const { title, uploadedAt } = wordList;
  const date = new Date(uploadedAt);
  if (!!wordList.id) {
    return (
      <div style={{ display: 'grid', rowGap: 16 }}>
        <div>{title}</div>
        <div>{`${date.getFullYear()}/${
          date.getMonth() + 1
        }/${date.getDate()} `}</div>
        <div>
          {words.map((word, index) => (
            <WordRow key={index} word={word} index={index} />
          ))}
        </div>
      </div>
    );
  } else {
    return <div>no word list</div>;
  }
};
