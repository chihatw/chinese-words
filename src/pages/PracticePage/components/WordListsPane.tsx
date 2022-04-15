import { Button } from '@mui/material';
import React, { useContext } from 'react';
import { AppContext } from '../../../services/context';
import { WordList } from '../../../services/useWordList';

const WordListsPane = () => {
  const { wordLists } = useContext(AppContext);
  return (
    <div>
      <div>wordLists</div>
      {wordLists.map((wordList, index) => (
        <WordListRow key={index} wordList={wordList} />
      ))}
    </div>
  );
};
const WordListRow = ({ wordList }: { wordList: WordList }) => {
  const { title, id } = wordList;
  const { setWordListId } = useContext(AppContext);
  return <Button onClick={() => setWordListId(id)}>{title}</Button>;
};

export default WordListsPane;
