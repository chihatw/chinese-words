import {
  orderBy,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
  where,
} from '@firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '../repositories/firebase';
import {
  snapshotCollection,
  updateDocument,
  batchDeleteDocuments,
  batchAddDocuments,
  getDocument,
  getDocumentsByQuery,
} from '../repositories/firebase/utils';

const COLLECTION = 'words';

export type Character = {
  form: string;
  pinyin: string;
};

export const INITIAL_CHARACTER: Character = {
  form: '',
  pinyin: '',
};

export type Word = {
  id: string;
  createdAt: number;
  wordListId: string;
  index: number;
  characters: Character[];
  sentence: string;
  japanese: string;
};

export type OmittedWord = Omit<Word, 'id' | 'createdAt' | 'wordListId'>;

export const INITIAL_WORD: Word = {
  id: '',
  createdAt: 0,
  wordListId: '',
  index: 0,
  characters: [],
  sentence: '',
  japanese: '',
};

export const useWords = (wordListId: string) => {
  const [words, setWords] = useState<Word[]>([]);

  const _snapshotCollection = useMemo(
    () =>
      function <T>({
        queries,
        setValues,
        buildValue,
      }: {
        queries?: QueryConstraint[];
        setValues: (value: T[]) => void;
        buildValue: (value: DocumentData) => T;
      }): Unsubscribe {
        return snapshotCollection({
          db,
          colId: COLLECTION,
          queries,
          setValues,
          buildValue,
        });
      },
    []
  );

  useEffect(() => {
    if (!wordListId) {
      setWords([]);
      return;
    }
    const unsub = _snapshotCollection({
      queries: [where('wordListId', '==', wordListId), orderBy('index')],
      setValues: setWords,
      buildValue: buildWord,
    });
    return () => {
      unsub();
    };
  }, [wordListId]);
  return { words };
};
export const useHandleWords = () => {
  const _getDocument = useMemo(
    () =>
      async function <T>({
        docId,
        initialValue,
        buildValue,
      }: {
        docId: string;
        initialValue: T;
        buildValue: (value: DocumentData) => T;
      }): Promise<T> {
        return await getDocument({
          db,
          colId: COLLECTION,
          docId,
          initialValue,
          buildValue,
        });
      },
    []
  );
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

  const getWord = async (docId: string) => {
    return await _getDocument({
      docId,
      initialValue: INITIAL_WORD,
      buildValue: buildWord,
    });
  };

  const getWordsByWordListId = async (wordListId: string) => {
    return await _getDocumentsByQuery({
      queries: [where('wordListId', '==', wordListId)],
      buildValue: buildWord,
    });
  };

  const updateWord = async (word: Word) => {
    return await _updateDocument(word);
  };

  const batchAddWords = async (words: Omit<Word, 'id'>[]) => {
    return await _batchAddDocuments(words);
  };

  const batchDeleteWords = async (ids: string[]) => {
    return await _batchDeleteDocuments(ids);
  };

  return {
    getWord,
    updateWord,
    batchAddWords,
    batchDeleteWords,
    getWordsByWordListId,
  };
};

const buildWord = (doc: DocumentData) => {
  const word: Word = {
    id: doc.id,
    createdAt: doc.data().createdAt,
    wordListId: doc.data().wordListId,
    index: doc.data().index,
    characters: doc.data().characters,
    sentence: doc.data().sentence,
    japanese: doc.data().japanese,
  };
  return word;
};

export const word2String = (word: Word) => {
  const lines: string[] = [];
  const { characters, sentence, japanese } = word;
  const chinese = characters.map((character) => character.form).join('');
  const pinyins = characters.map((character) => character.pinyin).join(' ');
  lines.push(chinese);
  lines.push(pinyins);
  lines.push(sentence);
  lines.push(japanese);
  return lines.join('\n');
};

export const string2Word = ({
  value,
  word,
  index,
}: {
  value: string;
  word?: Word;
  index?: number;
}) => {
  const lines = value.split('\n');
  const chinese = lines[0];
  const pinyins = lines[1]?.split(' ') || [];
  const sentence = lines[2] || '';
  const japanese = lines[3] || '';

  const characters = buildCharacters({ chinese, pinyins });

  const newWord: Word = {
    index: word?.index || index || 0,
    characters,
    sentence,
    japanese,
    id: word?.id || '',
    createdAt: word?.createdAt || 0,
    wordListId: word?.wordListId || '',
  };
  return newWord;
};

const buildCharacters = ({
  chinese,
  pinyins,
}: {
  chinese: string;
  pinyins: string[];
}) => {
  const characters: Character[] = [];
  const forms = chinese.split('');
  forms.forEach((form, index) => {
    const character: Character = {
      form,
      pinyin: pinyins[index] || '',
    };
    characters.push(character);
  });

  return characters;
};
