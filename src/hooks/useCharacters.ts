import { DocumentData, QueryConstraint, where } from 'firebase/firestore';
import { useMemo, useRef } from 'react';
import {
  addDocument,
  deleteDocument,
  getDocumentsByQuery,
  updateDocument,
} from '../repositories/firebase/utils';
import { db } from '../repositories/firebase';
import { INITIAL_PINYIN, Pinyin, string2Pinyin } from './useWords';

const COLLECTION = 'characters';

export type Character = {
  id: string;
  form: string;
  pinyins: {
    [key: string]: number;
  };
};

export const INITIAL_CHARACTER: Character = {
  id: '',
  form: '',
  pinyins: {},
};

export const useCharacters = () => {
  const characterMemoRef = useRef<{ [key: string]: Character }>({});
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

  const getCharacter_m = async (form: string) => {
    const memoKey = form;
    const memorized = characterMemoRef.current[memoKey];
    if (!!memorized) return memorized;

    const queries = [where('form', '==', form)];
    const [character, ...other] = await _getDocumentsByQuery({
      queries,
      buildValue: buildCharacter,
    });
    characterMemoRef.current = {
      ...characterMemoRef.current,
      [memoKey]: character,
    };
    return character;
  };

  const getPinyinFromForm_m = async (form: string) => {
    let pinyin = INITIAL_PINYIN;
    const character = await getCharacter_m(form);
    let max = 0;
    if (character) {
      for (const [pinyinStr, count] of Object.entries(character.pinyins)) {
        if (count > max) {
          pinyin = string2Pinyin(pinyinStr);
          max = count;
        }
      }
    }
    return pinyin;
  };
  return { getCharacter_m, getPinyinFromForm_m };
};

export const useHandleCharacters = () => {
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
  const _addDocument = useMemo(
    () =>
      async function <T extends { id: string }>(value: Omit<T, 'id'>) {
        return await addDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );
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
  const _deleteDocument = useMemo(
    () =>
      async function (id: string): Promise<boolean> {
        return await deleteDocument({
          id,
          db,
          colId: COLLECTION,
        });
      },
    []
  );
  const getCharactersByPinyin = async (pinyin: string) => {
    const queries = [where(`pinyins.${pinyin}`, '>', 0)];
    return await _getDocumentsByQuery({
      queries,
      buildValue: buildCharacter,
    });
  };
  const addCharacter = async ({
    form,
    pinyin,
  }: {
    form: string;
    pinyin: Pinyin;
  }) => {
    const { consonant, vowel, tone } = pinyin;
    const pinyinKey = consonant + vowel + tone;
    // 既に登録済みか確認
    const [character] = await _getDocumentsByQuery({
      queries: [where('form', '==', form)],
      buildValue: buildCharacter,
    });

    if (!character) {
      const { id, ...newCharacter }: Character = {
        ...INITIAL_CHARACTER,
        form,
        pinyins: { [pinyinKey]: 1 },
      };
      _addDocument(newCharacter);
    } else {
      const updateCharacter: Character = {
        ...character,
        pinyins: {
          ...character.pinyins,
          [pinyinKey]: (character.pinyins[pinyinKey] || 0) + 1,
        },
      };
      _updateDocument(updateCharacter);
    }
  };
  const updateCharacter = async (character: Character) => {
    return await _updateDocument(character);
  };
  const deleteCharacter = async (id: string) => {
    return await _deleteDocument(id);
  };
  return {
    addCharacter,
    updateCharacter,
    deleteCharacter,
    getCharactersByPinyin,
  };
};

const buildCharacter = (doc: DocumentData) => {
  const character: Character = {
    id: doc.id || '',
    form: doc.data().form || '',
    pinyins: doc.data().pinyins || {},
  };
  return character;
};
