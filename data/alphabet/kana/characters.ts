// data/alphabet/kana/characters.ts

import { KanaCharacter, KanaRow } from '@/types/alphabet';

// Helper to create character with consistent structure
function createKana(
  char: string,
  type: 'hiragana' | 'katakana',
  romaji: string,
  row: KanaRow,
  strokeCount: number
): KanaCharacter {
  return {
    id: `${type}-${romaji}`,
    character: char,
    type,
    romaji,
    row,
    strokeCount,
    strokeOrder: [], // SVG paths to be added later
  };
}

// あ-row (a, i, u, e, o)
export const HIRAGANA_A_ROW: KanaCharacter[] = [
  createKana('あ', 'hiragana', 'a', 'a', 3),
  createKana('い', 'hiragana', 'i', 'a', 2),
  createKana('う', 'hiragana', 'u', 'a', 2),
  createKana('え', 'hiragana', 'e', 'a', 2),
  createKana('お', 'hiragana', 'o', 'a', 3),
];

export const KATAKANA_A_ROW: KanaCharacter[] = [
  createKana('ア', 'katakana', 'a', 'a', 2),
  createKana('イ', 'katakana', 'i', 'a', 2),
  createKana('ウ', 'katakana', 'u', 'a', 3),
  createKana('エ', 'katakana', 'e', 'a', 3),
  createKana('オ', 'katakana', 'o', 'a', 3),
];

// か-row (ka, ki, ku, ke, ko)
export const HIRAGANA_KA_ROW: KanaCharacter[] = [
  createKana('か', 'hiragana', 'ka', 'ka', 3),
  createKana('き', 'hiragana', 'ki', 'ka', 4),
  createKana('く', 'hiragana', 'ku', 'ka', 1),
  createKana('け', 'hiragana', 'ke', 'ka', 3),
  createKana('こ', 'hiragana', 'ko', 'ka', 2),
];

export const KATAKANA_KA_ROW: KanaCharacter[] = [
  createKana('カ', 'katakana', 'ka', 'ka', 2),
  createKana('キ', 'katakana', 'ki', 'ka', 3),
  createKana('ク', 'katakana', 'ku', 'ka', 2),
  createKana('ケ', 'katakana', 'ke', 'ka', 3),
  createKana('コ', 'katakana', 'ko', 'ka', 2),
];

// さ-row (sa, shi, su, se, so)
export const HIRAGANA_SA_ROW: KanaCharacter[] = [
  createKana('さ', 'hiragana', 'sa', 'sa', 3),
  createKana('し', 'hiragana', 'shi', 'sa', 1),
  createKana('す', 'hiragana', 'su', 'sa', 2),
  createKana('せ', 'hiragana', 'se', 'sa', 3),
  createKana('そ', 'hiragana', 'so', 'sa', 1),
];

export const KATAKANA_SA_ROW: KanaCharacter[] = [
  createKana('サ', 'katakana', 'sa', 'sa', 3),
  createKana('シ', 'katakana', 'shi', 'sa', 3),
  createKana('ス', 'katakana', 'su', 'sa', 2),
  createKana('セ', 'katakana', 'se', 'sa', 2),
  createKana('ソ', 'katakana', 'so', 'sa', 2),
];

// た-row (ta, chi, tsu, te, to)
export const HIRAGANA_TA_ROW: KanaCharacter[] = [
  createKana('た', 'hiragana', 'ta', 'ta', 4),
  createKana('ち', 'hiragana', 'chi', 'ta', 2),
  createKana('つ', 'hiragana', 'tsu', 'ta', 1),
  createKana('て', 'hiragana', 'te', 'ta', 1),
  createKana('と', 'hiragana', 'to', 'ta', 2),
];

export const KATAKANA_TA_ROW: KanaCharacter[] = [
  createKana('タ', 'katakana', 'ta', 'ta', 3),
  createKana('チ', 'katakana', 'chi', 'ta', 3),
  createKana('ツ', 'katakana', 'tsu', 'ta', 3),
  createKana('テ', 'katakana', 'te', 'ta', 3),
  createKana('ト', 'katakana', 'to', 'ta', 2),
];

// な-row (na, ni, nu, ne, no)
export const HIRAGANA_NA_ROW: KanaCharacter[] = [
  createKana('な', 'hiragana', 'na', 'na', 4),
  createKana('に', 'hiragana', 'ni', 'na', 3),
  createKana('ぬ', 'hiragana', 'nu', 'na', 2),
  createKana('ね', 'hiragana', 'ne', 'na', 2),
  createKana('の', 'hiragana', 'no', 'na', 1),
];

export const KATAKANA_NA_ROW: KanaCharacter[] = [
  createKana('ナ', 'katakana', 'na', 'na', 2),
  createKana('ニ', 'katakana', 'ni', 'na', 2),
  createKana('ヌ', 'katakana', 'nu', 'na', 2),
  createKana('ネ', 'katakana', 'ne', 'na', 4),
  createKana('ノ', 'katakana', 'no', 'na', 1),
];

// は-row (ha, hi, fu, he, ho)
export const HIRAGANA_HA_ROW: KanaCharacter[] = [
  createKana('は', 'hiragana', 'ha', 'ha', 3),
  createKana('ひ', 'hiragana', 'hi', 'ha', 1),
  createKana('ふ', 'hiragana', 'fu', 'ha', 4),
  createKana('へ', 'hiragana', 'he', 'ha', 1),
  createKana('ほ', 'hiragana', 'ho', 'ha', 4),
];

export const KATAKANA_HA_ROW: KanaCharacter[] = [
  createKana('ハ', 'katakana', 'ha', 'ha', 2),
  createKana('ヒ', 'katakana', 'hi', 'ha', 2),
  createKana('フ', 'katakana', 'fu', 'ha', 1),
  createKana('ヘ', 'katakana', 'he', 'ha', 1),
  createKana('ホ', 'katakana', 'ho', 'ha', 4),
];

// ま-row (ma, mi, mu, me, mo)
export const HIRAGANA_MA_ROW: KanaCharacter[] = [
  createKana('ま', 'hiragana', 'ma', 'ma', 3),
  createKana('み', 'hiragana', 'mi', 'ma', 2),
  createKana('む', 'hiragana', 'mu', 'ma', 3),
  createKana('め', 'hiragana', 'me', 'ma', 2),
  createKana('も', 'hiragana', 'mo', 'ma', 3),
];

export const KATAKANA_MA_ROW: KanaCharacter[] = [
  createKana('マ', 'katakana', 'ma', 'ma', 2),
  createKana('ミ', 'katakana', 'mi', 'ma', 3),
  createKana('ム', 'katakana', 'mu', 'ma', 2),
  createKana('メ', 'katakana', 'me', 'ma', 2),
  createKana('モ', 'katakana', 'mo', 'ma', 3),
];

// や-row (ya, yu, yo)
export const HIRAGANA_YA_ROW: KanaCharacter[] = [
  createKana('や', 'hiragana', 'ya', 'ya', 3),
  createKana('ゆ', 'hiragana', 'yu', 'ya', 2),
  createKana('よ', 'hiragana', 'yo', 'ya', 2),
];

export const KATAKANA_YA_ROW: KanaCharacter[] = [
  createKana('ヤ', 'katakana', 'ya', 'ya', 2),
  createKana('ユ', 'katakana', 'yu', 'ya', 2),
  createKana('ヨ', 'katakana', 'yo', 'ya', 3),
];

// ら-row (ra, ri, ru, re, ro)
export const HIRAGANA_RA_ROW: KanaCharacter[] = [
  createKana('ら', 'hiragana', 'ra', 'ra', 2),
  createKana('り', 'hiragana', 'ri', 'ra', 2),
  createKana('る', 'hiragana', 'ru', 'ra', 1),
  createKana('れ', 'hiragana', 're', 'ra', 2),
  createKana('ろ', 'hiragana', 'ro', 'ra', 1),
];

export const KATAKANA_RA_ROW: KanaCharacter[] = [
  createKana('ラ', 'katakana', 'ra', 'ra', 2),
  createKana('リ', 'katakana', 'ri', 'ra', 2),
  createKana('ル', 'katakana', 'ru', 'ra', 2),
  createKana('レ', 'katakana', 're', 'ra', 1),
  createKana('ロ', 'katakana', 'ro', 'ra', 3),
];

// わ-row (wa, wo, n)
export const HIRAGANA_WA_ROW: KanaCharacter[] = [
  createKana('わ', 'hiragana', 'wa', 'wa', 2),
  createKana('を', 'hiragana', 'wo', 'wa', 3),
  createKana('ん', 'hiragana', 'n', 'wa', 1),
];

export const KATAKANA_WA_ROW: KanaCharacter[] = [
  createKana('ワ', 'katakana', 'wa', 'wa', 2),
  createKana('ヲ', 'katakana', 'wo', 'wa', 3),
  createKana('ン', 'katakana', 'n', 'wa', 2),
];

// All hiragana and katakana by row
export const ALL_HIRAGANA = [
  ...HIRAGANA_A_ROW,
  ...HIRAGANA_KA_ROW,
  ...HIRAGANA_SA_ROW,
  ...HIRAGANA_TA_ROW,
  ...HIRAGANA_NA_ROW,
  ...HIRAGANA_HA_ROW,
  ...HIRAGANA_MA_ROW,
  ...HIRAGANA_YA_ROW,
  ...HIRAGANA_RA_ROW,
  ...HIRAGANA_WA_ROW,
];

export const ALL_KATAKANA = [
  ...KATAKANA_A_ROW,
  ...KATAKANA_KA_ROW,
  ...KATAKANA_SA_ROW,
  ...KATAKANA_TA_ROW,
  ...KATAKANA_NA_ROW,
  ...KATAKANA_HA_ROW,
  ...KATAKANA_MA_ROW,
  ...KATAKANA_YA_ROW,
  ...KATAKANA_RA_ROW,
  ...KATAKANA_WA_ROW,
];

// Helper to get character by romaji
export function getKanaByRomaji(
  romaji: string,
  type: 'hiragana' | 'katakana'
): KanaCharacter | undefined {
  const list = type === 'hiragana' ? ALL_HIRAGANA : ALL_KATAKANA;
  return list.find((k) => k.romaji === romaji);
}
