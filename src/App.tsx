import React, { useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { AppContext } from './services/context';
import { useWordList } from './hooks/useWordList';
import { useWords } from './hooks/useWords';
import { useIndexes } from './hooks/useIndexes';
import { useCharacters } from './hooks/useCharacters';

function App() {
  const [wordListId, setWordListId] = useState('');
  const { wordList, wordLists } = useWordList({ wordListId, setWordListId });
  const { words, getWord_m } = useWords(wordListId);
  const { getWordIdsByIndexes_m } = useIndexes();
  const { getCharacter_m, getPinyinFromForm_m } = useCharacters();
  return (
    <AppContext.Provider
      value={{
        words,
        wordList,
        wordLists,
        getWord_m,
        setWordListId,
        getWordIdsByIndexes_m,
        getCharacter_m,
        getPinyinFromForm_m,
      }}
    >
      <AppRoutes />
    </AppContext.Provider>
  );
}

export default App;
