import { Delete, Edit, Subject } from '@mui/icons-material';
import React from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import { WordList } from '../../../hooks/useWordList';

const WordListRow = ({
  wordList,
  handleOpenList,
  handleClickEdit,
  handleClickDelete,
}: {
  wordList: WordList;
  handleOpenList: () => void;
  handleClickEdit: () => void;
  handleClickDelete: () => void;
}) => {
  const { title } = wordList;
  return (
    <TableRow>
      <TableCell>{title}</TableCell>
      <TableCell>
        <IconButton onClick={handleClickEdit}>
          <Edit />
        </IconButton>
      </TableCell>
      <TableCell>
        <IconButton onClick={handleOpenList}>
          <Subject />
        </IconButton>
      </TableCell>
      <TableCell>
        <IconButton onClick={handleClickDelete}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default WordListRow;
