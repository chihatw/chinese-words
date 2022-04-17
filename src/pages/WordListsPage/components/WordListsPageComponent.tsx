import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Button,
} from '@mui/material';
import React from 'react';
import { NavigateFunction } from 'react-router-dom';

import AppLayout from '../../../layout/AppLayout';
import { WordList } from '../../../hooks/useWordList';
import WordListRow from './WordListRow';

const WordListsPageComponent = ({
  wordLists,
  navigate,
  handleOpenList,
  handleClickEdit,
  handleClickCreate,
  handleClickDelete,
}: {
  wordLists: WordList[];
  navigate: NavigateFunction;
  handleClickCreate: () => void;
  handleOpenList: (value: string) => void;
  handleClickEdit: (value: string) => void;
  handleClickDelete: (value: string) => void;
}) => {
  return (
    <AppLayout>
      <div>
        <h1>WordLists</h1>
        <Button onClick={() => navigate('/')}>戻る</Button>
        <Button onClick={handleClickCreate}>新規作成</Button>
      </div>
      <Table size='small'>
        <TableBody>
          {wordLists.map((wordList, index) => (
            <WordListRow
              key={index}
              wordList={wordList}
              handleOpenList={() => handleOpenList(wordList.id)}
              handleClickEdit={() => handleClickEdit(wordList.id)}
              handleClickDelete={() => handleClickDelete(wordList.id)}
            />
          ))}
        </TableBody>
      </Table>
    </AppLayout>
  );
};

export default WordListsPageComponent;
