import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EditWordListPage from '../pages/EditWordListPage';
import PracticePage from '../pages/PracticePage';
import SearchPage from '../pages/SearchPage';
import TopPage from '../pages/TopPage';
import WordListPage from '../pages/WordListPage';
import WordListsPage from '../pages/WordListsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<TopPage />} />
      <Route path='/lists' element={<WordListsPage />} />
      <Route path='/list/edit' element={<EditWordListPage />} />
      <Route path='/list' element={<WordListPage />} />
      <Route path='/practice' element={<PracticePage />} />
      <Route path='/search' element={<SearchPage />} />
    </Routes>
  );
};

export default AppRoutes;
