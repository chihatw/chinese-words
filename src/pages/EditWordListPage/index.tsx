import { Button, Container, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../services/context';
import { useHandleWordLists, WordList } from '../../services/useWordList';
import { useHandleWords } from '../../services/useWords';

const EditWordListPage = () => {
  const navigate = useNavigate();
  const { wordList } = useContext(AppContext);

  const { addWordList, updateWordList } = useHandleWordLists();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [uploadedAtStr, setUploadedAtStr] = useState('');

  useEffect(() => {
    const { title, url, uploadedAt } = wordList;
    setTitle(title);
    setUrl(url);
    const date = new Date(uploadedAt);
    setUploadedAtStr(
      `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    );
  }, [wordList]);

  const hancleClickSubmit = async () => {
    const date = new Date(uploadedAtStr);
    const uploadedAt = date.getTime();

    if (!!wordList.id) {
      const newWordList: WordList = {
        ...wordList,
        title,
        url,
        uploadedAt,
      };
      const result = await updateWordList(newWordList);
      if (!!result) {
        navigate('/lists');
      }
    } else {
      const newWordList: Omit<WordList, 'id'> = {
        createdAt: Date.now(),
        title,
        url,
        uploadedAt,
      };
      const result = await addWordList(newWordList);
      if (!!result) {
        navigate('/lists');
      }
    }
  };
  return (
    <Container maxWidth='sm' sx={{ marginTop: 5 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <h1>Edit WordList</h1>
        <div>
          <Button onClick={() => navigate('/lists')}>戻る</Button>
        </div>
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label='title'
        />
        <TextField
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          label='url'
        />
        <TextField
          value={uploadedAtStr}
          onChange={(e) => setUploadedAtStr(e.target.value)}
          label='uploadedAt'
        />
        <Button onClick={hancleClickSubmit}>submit</Button>
      </div>
    </Container>
  );
};

export default EditWordListPage;
