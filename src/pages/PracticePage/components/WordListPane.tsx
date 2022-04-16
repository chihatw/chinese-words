import React, { useContext } from 'react';
import WordRow from '../../../components/WordRow';
import { AppContext } from '../../../services/context';

const WordListPane = ({ isPractice }: { isPractice?: boolean }) => {
  const { words, wordList } = useContext(AppContext);
  const { title, uploadedAt } = wordList;
  const date = new Date(uploadedAt);
  const dateStr = `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()}`;
  if (!!wordList.id) {
    return (
      <div style={{ display: 'grid', rowGap: 16 }}>
        <div>{`${title.slice(0, 10)}... ${dateStr}`}</div>
        {words.map((word, index) => (
          <WordRow
            key={index}
            word={word}
            index={index}
            isPractice={isPractice}
          />
        ))}
      </div>
    );
  } else {
    return <div>no word list</div>;
  }
};

export default WordListPane;
