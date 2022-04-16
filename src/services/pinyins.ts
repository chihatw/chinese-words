import { INITIAL_PINYIN, Pinyin } from './useWords';

export const string2Pinyin = (value: string): Pinyin => {
  const tail = value.slice(-1);
  let tone = '';
  if (['0', '1', '2', '3', '4'].includes(tail)) {
    tone = tail;
  }

  const valueNoTone = value.slice(0, value.length - tone.length);
  const consonant = getConsonant(valueNoTone);
  const remainder = valueNoTone.slice(consonant.length);
  const vowel = getVowel(remainder);

  const pinyin: Pinyin = {
    consonant,
    vowel,
    tone: !!vowel ? tone : '', // 四声 は 母音が必要
  };

  return pinyin;
};

export const pinyin2String = (pinyin: Pinyin): string => {
  const { consonant, vowel, tone } = pinyin;
  return consonant + vowel + tone;
};

const getVowel = (value: string) => {
  let vowel = '';
  for (const vowelGroup of vowelGroups) {
    if (vowelGroup.includes(value)) {
      vowel = value;
      break;
    }
  }
  return vowel;
};

const getConsonant = (value: string) => {
  let consonant = '';
  let head = value.slice(0, 2);
  if (consonants_1.includes(head)) {
    consonant = head;
  } else {
    head = value.slice(0, 1);
    if (consonants_0.includes(head)) {
      consonant = head;
    }
  }
  return consonant;
};

const consonants_0 = ['bpmf', 'dtnl', 'zcs', 'r', 'jqx', 'gkh', 'yw']
  .join('')
  .split('');
const consonants_1 = ['zh', 'ch', 'sh'];

const vowelGroups = [
  ['uang', 'iang', 'iong'],
  ['ang', 'ong', 'eng', 'ing', 'uan', 'van', 'ian', 'iao', 'uai'],
  [
    'an',
    'en',
    'un',
    'vn',
    'in',
    'ai',
    'ei',
    'ui',
    'ao',
    'uo',
    'ou',
    'iu',
    've',
    'ie',
    'ua',
    'ia',
    'er',
  ],
  ['a', 'o', 'e', 'u', 'v', 'i'],
];

// base data
const vowels_0 = ['a', 'o', 'e', 'u', 'v', 'i']; // 6
const vowels_1 = ['an', 'en', 'un', 'vn', 'in']; // 5
const vowels_2 = ['ang', 'ong', 'eng', 'ing']; // 4
const vowels_3 = ['ai', 'ei', 'ui']; // 3
const vowels_4 = ['ao', 'uo']; // 2
const vowels_5 = ['ou', 'iu']; // 2
const vowels_6 = ['ve', 'ie']; // 2
const vowels_7 = ['ua', 'ia']; // 2
const vowels_8 = ['uan', 'van', 'ian']; // 3
const vowels_9 = ['uang', 'iang']; // 2
const vowels_10 = ['iao', 'uai', 'iong', 'er']; // 4

const buildVowelGroups = () => {
  const vowels = [
    vowels_0,
    vowels_1,
    vowels_2,
    vowels_3,
    vowels_4,
    vowels_5,
    vowels_6,
    vowels_7,
    vowels_8,
    vowels_9,
    vowels_10,
  ].flat();

  const len_1: string[] = [];
  const len_2: string[] = [];
  const len_3: string[] = [];
  const len_4: string[] = [];

  for (const vowel of vowels) {
    switch (vowel.length) {
      case 1:
        len_1.push(vowel);
        break;
      case 2:
        len_2.push(vowel);
        break;
      case 3:
        len_3.push(vowel);
        break;
      case 4:
        len_4.push(vowel);
        break;
      default:
    }
  }
  return [len_4, len_3, len_2, len_1];
};
