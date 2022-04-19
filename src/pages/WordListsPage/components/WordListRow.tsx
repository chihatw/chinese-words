import { Delete, Edit, Subject, Title } from '@mui/icons-material';
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
  const { uploadedAt, title } = wordList;
  const date = new Date(uploadedAt);
  return (
    <TableRow>
      <TableCell>{`${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`}</TableCell>
      <TableCell>{title.slice(0, 8)}</TableCell>
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
