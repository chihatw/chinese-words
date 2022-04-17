export const getVowel = (value: string) => {
  let vowel = '';
  for (const vowelGroup of vowelGroups) {
    if (vowelGroup.includes(value)) {
      vowel = value;
      break;
    }
  }
  return vowel;
};

export const getConsonant = (value: string) => {
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

const consonants_0 = ['bpmf', 'dtnl', 'zcs', 'r', 'jqx', 'gkh']
  .join('')
  .split('');
const consonants_1 = ['zh', 'ch', 'sh'];

const vowelGroups = [
  ['ying', 'yuan', 'uang', 'iang', 'wang', 'yang', 'iong', 'yong', 'weng'],
  [
    'yin',
    'wen',
    'yun',
    'ang',
    'ong',
    'eng',
    'ing',
    'wei',
    'you',
    'yue',
    'uan',
    'van',
    'ian',
    'wan',
    'yan',
    'iao',
    'uai',
    'yao',
    'wai',
  ],
  [
    'yi',
    'wu',
    'yu',
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
    'wo',
    'ou',
    'iu',
    've',
    'ie',
    'ue',
    'ye',
    'ua',
    'ia',
    'ya',
    'wa',
    'er',
  ],
  ['a', 'o', 'e', 'u', 'v', 'i'],
];

// base data
const vowels_0 = ['a', 'o', 'e', 'u', 'v', 'i', 'yi', 'wu', 'yu']; // 6+3
const vowels_1 = ['an', 'en', 'un', 'vn', 'in', 'yin', 'wen', 'yun']; // 5+3
const vowels_2 = ['ang', 'ong', 'eng', 'ing', 'ying']; // 4+1
const vowels_3 = ['ai', 'ei', 'ui', 'wei']; // 3+1
const vowels_4 = ['ao', 'uo', 'wo']; // 2+1
const vowels_5 = ['ou', 'iu', 'you']; // 2+1
const vowels_6 = ['ve', 'ie', 'ue', 'ye', 'yue']; // 3+2
const vowels_7 = ['ua', 'ia', 'ya', 'wa']; // 2+2
const vowels_8 = ['uan', 'van', 'ian', 'wan', 'yan', 'yuan']; // 3+3
const vowels_9 = ['uang', 'iang', 'wang', 'yang']; // 2+2
const vowels_10 = ['iao', 'uai', 'iong', 'er', 'yao', 'wai', 'yong', 'weng']; // 4+4

export const buildVowelGroups = () => {
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
