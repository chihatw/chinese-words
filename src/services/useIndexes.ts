import {
  limit,
  DocumentData,
  QueryConstraint,
  where,
} from '@firebase/firestore';
import { useCallback, useMemo } from 'react';
import { db } from '../repositories/firebase';
import {
  updateDocument,
  batchSetDocuments,
  getDocumentsByQuery,
  batchDeleteDocuments,
} from '../repositories/firebase/utils';
import { Word } from './useWords';

const COLLECTION = 'indexes';

export type Index = {
  id: string;
  wordFormIndexes: { [key: string]: boolean };
  wordPinyinIndexes: { [key: string]: boolean };
};

export const INITIAL_INDEX: Index = {
  id: '',
  wordFormIndexes: {},
  wordPinyinIndexes: {},
};

export const useHandleIndexes = () => {
  const _updateDocument = useMemo(
    () =>
      async function <T extends { id: string }>(value: T): Promise<T | null> {
        return await updateDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );
  const _batchSetDocuments = useMemo(
    () =>
      async function <T extends { id: string }>(values: T[]): Promise<boolean> {
        return await batchSetDocuments({ db, colId: COLLECTION, values });
      },
    []
  );
  const _batchDeleteDocuments = useCallback(async (ids: string[]) => {
    return await batchDeleteDocuments({ db, colId: COLLECTION, ids });
  }, []);

  const _getDocumentsByQuery = async <T>({
    queries,
    buildValue,
  }: {
    queries?: QueryConstraint[];
    buildValue: (value: DocumentData) => T;
  }): Promise<T[]> => {
    return await getDocumentsByQuery({
      db,
      colId: COLLECTION,
      queries,
      buildValue,
    });
  };

  const updateIndex = async (value: Index) => {
    return await _updateDocument(value);
  };

  const batchSetIndexes = async (values: Index[]) => {
    return await _batchSetDocuments(values);
  };

  const batchDeleteIndexes = async (ids: string[]) => {
    return await _batchDeleteDocuments(ids);
  };

  const getWordIdsByIndexes = async ({
    max,
    type,
    indexes: _indexes,
  }: {
    max?: number;
    type: 'form' | 'pinyin';
    indexes: string[];
  }): Promise<string[]> => {
    const queries = [];

    switch (type) {
      case 'form':
        for (const index of _indexes) {
          queries.push(where(`wordFormIndexes.${index}`, '==', true));
        }
        break;
      case 'pinyin':
        for (const index of _indexes) {
          queries.push(where(`wordPinyinIndexes.${index}`, '==', true));
        }
        break;
      default:
    }

    if (!!max) {
      queries.push(limit(max));
    }

    const indexes = await _getDocumentsByQuery({
      queries,
      buildValue: buildIndex,
    });
    const wordIds = indexes.map((index) => index.id);
    return wordIds;
  };

  return {
    updateIndex,
    batchSetIndexes,
    batchDeleteIndexes,
    getWordIdsByIndexes,
  };
};

const buildIndex = (doc: DocumentData) => {
  const index: Index = {
    id: doc.id || '',
    wordFormIndexes: doc.data().wordFormIndexes || {},
    wordPinyinIndexes: doc.data().wordPinyinIndexes || {},
  };
  return index;
};

export const word2Index = (word: Pick<Word, 'characters' | 'id'>) => {
  const { id, characters } = word;
  const index: Index = {
    id,
    wordFormIndexes: {},
    wordPinyinIndexes: {},
  };
  for (const { form, pinyin } of characters) {
    const { consonant, vowel, tone } = pinyin;
    index.wordFormIndexes[form] = true;
    index.wordPinyinIndexes[consonant + vowel + tone] = true;
    index.wordPinyinIndexes[consonant + vowel] = true;
    index.wordPinyinIndexes[vowel + tone] = true;
    index.wordPinyinIndexes[vowel] = true;
    index.wordPinyinIndexes[consonant] = true;
  }
  return index;
};
