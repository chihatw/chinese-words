import { Delete, Edit } from '@mui/icons-material';
import { Collapse, IconButton } from '@mui/material';
import React, { useState } from 'react';
import WordRow from './WordRow';
import { useHandleIndexes } from '../hooks/useIndexes';
import { useHandleWords, Word } from '../hooks/useWords';
import EditWordPane from '../pages/WordListPage/components/EditWordPane';

const WordRowContainer = ({
  index,
  word,
  deleteCallback,
  updateCallback: superUpdateCallback,
}: {
  word: Word;
  index: number;
  deleteCallback?: () => void;
  updateCallback?: () => void;
}) => {
  const { deleteWord } = useHandleWords();
  const { deleteIndex } = useHandleIndexes();

  const [open, setOpen] = useState(false);
  const handleClickDelete = async () => {
    if (
      window.confirm(
        `「${word.characters.map((c) => c.form).join('')}」を削除しますか？`
      )
    ) {
      await deleteWord(word.id);
      await deleteIndex(word.id);
      !!deleteCallback && deleteCallback();
    }
  };
  const updateCallback = () => {
    setOpen(false);
    !!superUpdateCallback && superUpdateCallback();
  };
  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ flexGrow: 1 }}>
          <WordRow word={word} index={index} />
        </div>
        {word.id && (
          <>
            <IconButton onClick={() => setOpen(!open)}>
              <Edit />
            </IconButton>
            <IconButton onClick={handleClickDelete}>
              <Delete />
            </IconButton>
          </>
        )}
      </div>
      <Collapse in={open}>
        <EditWordPane word={word} callback={updateCallback} />
      </Collapse>
    </div>
  );
};

export default WordRowContainer;
