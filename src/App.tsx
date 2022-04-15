import React from 'react';
import { useWordList } from './services/useWordList';

function App() {
  useWordList();
  return <div>hello</div>;
}

export default App;
