import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Button,
} from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../services/context';
import { useHandleIndexes } from '../../hooks/useIndexes';
import { useHandleWordLists } from '../../hooks/useWordList';
import { useHandleWords } from '../../hooks/useWords';
import WordListsPageComponent from './components/WordListsPageComponent';

const WordListsPage = () => {
  const navigate = useNavigate();
  const { wordLists, setWordListId } = useContext(AppContext);
  const { deleteWordList } = useHandleWordLists();
  const { batchDeleteIndexes } = useHandleIndexes();
  const { getWordsByWordListId, batchDeleteWords } = useHandleWords();

  const handleClickEdit = (wordListId: string) => {
    setWordListId(wordListId);
    setTimeout(() => {
      navigate('/list/edit');
    }, 100);
  };

  const handleClickCreate = () => {
    setWordListId('');
    setTimeout(() => {
      navigate('/list/edit');
    }, 100);
  };

  const handleClickDelete = async (wordListId: string) => {
    const wordList = wordLists.filter(
      (wordList) => wordList.id === wordListId
    )[0];

    if (window.confirm(`delete ${wordList.title}?`)) {
      deleteWordList(wordListId);
      const words = await getWordsByWordListId(wordList.id);
      const wordIds = words.map((word) => word.id);
      batchDeleteWords(wordIds);
      batchDeleteIndexes(wordIds);
    }
  };

  const handleOpenList = (wordListId: string) => {
    setWordListId(wordListId);
    setTimeout(() => {
      navigate('/list');
    }, 100);
  };

  return (
    <WordListsPageComponent
      wordLists={wordLists}
      navigate={navigate}
      handleOpenList={handleOpenList}
      handleClickEdit={handleClickEdit}
      handleClickCreate={handleClickCreate}
      handleClickDelete={handleClickDelete}
    />
  );
};

export default WordListsPage;
