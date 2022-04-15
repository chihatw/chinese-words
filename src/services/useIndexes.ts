import {
  limit,
  DocumentData,
  QueryConstraint,
  where,
} from '@firebase/firestore';
import { useCallback, useMemo } from 'react';
import { db } from '../repositories/firebase';
import {
  batchDeleteDocuments,
  batchAddDocuments,
  getDocumentsByQuery,
} from '../repositories/firebase/utils';
import { Word } from './useWords';

const COLLECTION = 'indexes';

export type Index = {
  id: string;
  wordId: string;
  wordFormIndexes: { [key: string]: boolean };
  wordPinyinIndexes: { [key: string]: boolean };
  wordPinyinNoToneIndexes: { [key: string]: boolean };
};

export const INITIAL_INDEX: Index = {
  id: '',
  wordId: '',
  wordFormIndexes: {},
  wordPinyinIndexes: {},
  wordPinyinNoToneIndexes: {},
};

export const useHandleIndexes = () => {
  const _batchAddDocuments = useMemo(
    () =>
      async function <T extends { id: string }>(
        values: Omit<T, 'id'>[]
      ): Promise<string[]> {
        return await batchAddDocuments({ db, colId: COLLECTION, values });
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

  const batchAddIndexes = async (values: Omit<Index, 'id'>[]) => {
    return await _batchAddDocuments(values);
  };

  const batchDeleteIndexesByWordIds = async (wordIds: string[]) => {
    const ids: string[] = [];

    await Promise.all(
      wordIds.map(async (wordId) => {
        const result = await _getDocumentsByQuery({
          queries: [where('wordId', '==', wordId)],
          buildValue: buildIndex,
        });
        if (!!result.length) {
          ids.push(result[0].id);
        }
      })
    );
    if (!!ids.length) {
      return await _batchDeleteDocuments(ids);
    }
    return true;
  };

  const getWordIdsByIndexes = async ({
    max,
    type,
    value,
  }: {
    max?: number;
    type: 'pinyinNoTone' | 'form' | 'pinyin';
    value: string;
  }): Promise<string[]> => {
    const queries = [];

    switch (type) {
      case 'pinyinNoTone':
        for (const index of value.split(' ')) {
          queries.push(where(`wordPinyinNoToneIndexes.${index}`, '==', true));
        }
        break;
      case 'form':
        for (const index of value.split('')) {
          queries.push(where(`wordFormIndexes.${index}`, '==', true));
        }
        break;
      case 'pinyin':
        for (const index of value.split(' ')) {
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
    const wordIds = indexes.map((index) => index.wordId);
    return wordIds;
  };

  return {
    batchAddIndexes,
    getWordIdsByIndexes,
    batchDeleteIndexesByWordIds,
  };
};

const buildIndex = (doc: DocumentData) => {
  const index: Index = {
    id: doc.id,
    wordId: doc.data().wordId,
    wordFormIndexes: doc.data().wordFormIndexes,
    wordPinyinIndexes: doc.data().wordPinyinIndexes,
    wordPinyinNoToneIndexes: doc.data().wordPinyinNoToneIndexes,
  };
  return index;
};

export const words2Indexes = (words: Word[]) => {
  const indexes: Omit<Index, 'id'>[] = [];
  for (const word of words) {
    const { characters } = word;
    const newIndex: Omit<Index, 'id'> = {
      wordId: word.id,
      wordFormIndexes: {},
      wordPinyinIndexes: {},
      wordPinyinNoToneIndexes: {},
    };
    for (const { form, pinyin } of characters) {
      newIndex.wordFormIndexes[form] = true;
      newIndex.wordPinyinIndexes[pinyin] = true;
      const pinyinNoTone = pinyin.replace(/[1-4]/g, '');
      newIndex.wordPinyinNoToneIndexes[pinyinNoTone] = true;
    }
    indexes.push(newIndex);
  }
  return indexes;
};
