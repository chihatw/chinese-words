import { Button } from '@mui/material';
import React, { useContext } from 'react';
import { AppContext } from '../../../services/context';
import { WordList } from '../../../hooks/useWordList';

const WordListsPane = () => {
  const { wordLists } = useContext(AppContext);
  return (
    <div>
      <div>単語リスト一覧</div>
      {wordLists.map((wordList, index) => (
        <WordListRow key={index} wordList={wordList} />
      ))}
    </div>
  );
};
const WordListRow = ({ wordList }: { wordList: WordList }) => {
  const { id, uploadedAt } = wordList;
  const date = new Date(uploadedAt);
  const { setWordListId } = useContext(AppContext);
  return (
    <div>
      <Button onClick={() => setWordListId(id)}>{`${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`}</Button>
    </div>
  );
};

export default WordListsPane;
