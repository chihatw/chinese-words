import React, { useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { AppContext } from './services/context';
import { useWordList } from './services/useWordList';

function App() {
  const [wordListId, setWordListId] = useState('');
  useWordList();
  return (
    <AppContext.Provider value={{ setWordListId }}>
      <AppRoutes />
    </AppContext.Provider>
  );
}

export default App;
