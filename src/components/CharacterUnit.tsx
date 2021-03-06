import { useTheme } from '@mui/system';
import React from 'react';
import { Pinyin, pinyin2String } from '../hooks/useWords';

const CharacterUnit = ({ form, pinyin }: { form: string; pinyin: Pinyin }) => {
  const theme = useTheme();
  let mark = '　';
  const tone = pinyin.tone;
  switch (tone) {
    case '1':
      mark = '‾';
      break;
    case '2':
      mark = 'ˊ';
      break;
    case '3':
      mark = 'ˇ';
      break;
    case '4':
      mark = 'ˋ';
      break;
    case '0':
      mark = '˙';
      break;
    default:
  }
  return (
    <div style={{ display: 'grid', marginRight: 4 }}>
      <div
        style={{
          textAlign: 'center',
          fontSize: 8,
          color: '#aaa',
          marginBottom: -8,
        }}
      >
        {pinyin2String(pinyin)}
      </div>
      <div
        style={{
          textAlign: 'center',
          fontSize: 32,
          marginBottom: -28,
          color: 'red',
        }}
      >
        {mark}
      </div>
      <div
        style={{
          ...(theme.typography as any).notoSerifTC,
          textAlign: 'center',
          fontSize: 20,
        }}
      >
        {form}
      </div>
    </div>
  );
};

export default CharacterUnit;
