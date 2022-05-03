import DeleteIcon from '@mui/icons-material/Delete';
import { Button, IconButton, TextField } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Character, useHandleCharacters } from '../../hooks/useCharacters';
import { pinyin2String, string2Pinyin } from '../../hooks/useWords';
import AppLayout from '../../layout/AppLayout';
import { AppContext } from '../../services/context';

const CharacterPage = () => {
  const navigate = useNavigate();
  const { getCharacter_m } = useContext(AppContext);
  const { getCharactersByPinyin } = useHandleCharacters();
  const [form, setForm] = useState('');
  const [pinyinStr, setPinyinStr] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const searchByForm = async () => {
    if (!form) return;
    const character = await getCharacter_m(form);
    if (character) {
      setCharacters([character]);
    } else {
      setCharacters([]);
    }
  };
  const searchByPinyin = async () => {
    const pinyin = string2Pinyin(pinyinStr);
    if (!pinyin.vowel) return;

    const characters =
      (await getCharactersByPinyin(pinyin2String(pinyin))) || [];
    setCharacters(characters);
  };
  return (
    <AppLayout>
      <div>
        <h1>Character</h1>
        <Button onClick={() => navigate('/')}>戻る</Button>
      </div>
      <div style={{ display: 'flex' }}>
        <TextField
          size='small'
          value={form}
          onChange={(e) => setForm(e.target.value)}
          label='form'
          sx={{ flexGrow: 1 }}
        />
        <Button onClick={searchByForm}>検索</Button>
      </div>
      <div style={{ display: 'flex' }}>
        <TextField
          size='small'
          value={pinyinStr}
          onChange={(e) => setPinyinStr(e.target.value)}
          label='pinyinStr'
          sx={{ flexGrow: 1 }}
        />
        <Button onClick={searchByPinyin}>検索</Button>
      </div>
      {characters.map((character, index) => (
        <CharacterRow key={index} character={character} index={index} />
      ))}
    </AppLayout>
  );
};

export default CharacterPage;

const CharacterRow = ({
  character,
  index,
}: {
  character: Character;
  index: number;
}) => {
  const { form, pinyins, id } = character;
  const { deleteCharacter } = useHandleCharacters();

  const handleDelete = () => {
    deleteCharacter(id);
  };

  return (
    <div style={{ border: '1px solid #eee', padding: 8, borderRadius: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flexGrow: 1 }}>
          <div>{`${index + 1}.`}</div>
          <div>{form}</div>
          {Object.entries(pinyins).map(([pinyin, count], index) => (
            <div key={index}>{`${pinyin}: ${count}`}</div>
          ))}
        </div>
        <div>
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
