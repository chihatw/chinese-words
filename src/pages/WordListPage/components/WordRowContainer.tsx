import { Edit } from '@mui/icons-material';
import { Collapse, IconButton } from '@mui/material';
import React, { useState } from 'react';
import WordRow from '../../../components/WordRow';
import { Word } from '../../../services/useWords';
import EditWordPane from './EditWordPane';

const WordRowContainer = ({ index, word }: { word: Word; index: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ flexGrow: 1 }}>
          <WordRow word={word} index={index} />
        </div>
        {word.id && (
          <IconButton onClick={() => setOpen(!open)}>
            <Edit />
          </IconButton>
        )}
      </div>
      <Collapse in={open}>
        <EditWordPane word={word} callback={() => setOpen(false)} />
      </Collapse>
    </div>
  );
};

export default WordRowContainer;
