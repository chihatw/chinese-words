import { Delete, Edit, MenuBook, Subject } from '@mui/icons-material';
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  Menu,
  Button,
} from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../services/context';
import { useHandleWordLists, WordList } from '../../services/useWordList';

const WordListsPage = () => {
  const navigate = useNavigate();
  const { wordLists, setWordListId } = useContext(AppContext);
  const { deleteWordList } = useHandleWordLists();

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

  const handleClickDelete = (wordListId: string) => {
    const wordList = wordLists.filter(
      (wordList) => wordList.id === wordListId
    )[0];
    if (window.confirm(`delete ${wordList.title}?`)) {
      deleteWordList(wordListId);
    }
  };

  const handleOpenList = (wordListId: string) => {
    setWordListId(wordListId);
    setTimeout(() => {
      navigate('/list');
    }, 100);
  };

  return (
    <Container maxWidth='sm' sx={{ marginTop: 5 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <h1>WordLists</h1>
        <div>
          <Button onClick={() => navigate('/')}>戻る</Button>
        </div>
        <div>
          <Button onClick={handleClickCreate}>新規作成</Button>
        </div>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>title</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
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
      </div>
    </Container>
  );
};

export default WordListsPage;

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
