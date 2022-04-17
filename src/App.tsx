import React, { useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { AppContext } from './services/context';
import { useWordList } from './hooks/useWordList';
import { useWords } from './hooks/useWords';

function App() {
  const [wordListId, setWordListId] = useState('');
  const { wordList, wordLists } = useWordList({ wordListId, setWordListId });
  const { words } = useWords(wordListId);
  return (
    <AppContext.Provider value={{ setWordListId, wordList, wordLists, words }}>
      <AppRoutes />
    </AppContext.Provider>
  );
}

export default App;
