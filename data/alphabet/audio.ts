// data/alphabet/audio.ts

// Audio file paths for kana pronunciation
// Generated using edge-tts with ja-JP-NanamiNeural voice
// Files are served from public/audio/kana for web

export const KANA_AUDIO_BASE_PATH = '/audio/kana';

export interface KanaAudio {
  romaji: string;
  audioFile: string;
}

// For now, we'll use a text-to-speech approach or placeholder
// In production, replace with actual audio file paths
export const KANA_AUDIO: Record<string, KanaAudio> = {
  a: { romaji: 'a', audioFile: `${KANA_AUDIO_BASE_PATH}/a.mp3` },
  i: { romaji: 'i', audioFile: `${KANA_AUDIO_BASE_PATH}/i.mp3` },
  u: { romaji: 'u', audioFile: `${KANA_AUDIO_BASE_PATH}/u.mp3` },
  e: { romaji: 'e', audioFile: `${KANA_AUDIO_BASE_PATH}/e.mp3` },
  o: { romaji: 'o', audioFile: `${KANA_AUDIO_BASE_PATH}/o.mp3` },
  ka: { romaji: 'ka', audioFile: `${KANA_AUDIO_BASE_PATH}/ka.mp3` },
  ki: { romaji: 'ki', audioFile: `${KANA_AUDIO_BASE_PATH}/ki.mp3` },
  ku: { romaji: 'ku', audioFile: `${KANA_AUDIO_BASE_PATH}/ku.mp3` },
  ke: { romaji: 'ke', audioFile: `${KANA_AUDIO_BASE_PATH}/ke.mp3` },
  ko: { romaji: 'ko', audioFile: `${KANA_AUDIO_BASE_PATH}/ko.mp3` },
  sa: { romaji: 'sa', audioFile: `${KANA_AUDIO_BASE_PATH}/sa.mp3` },
  shi: { romaji: 'shi', audioFile: `${KANA_AUDIO_BASE_PATH}/shi.mp3` },
  su: { romaji: 'su', audioFile: `${KANA_AUDIO_BASE_PATH}/su.mp3` },
  se: { romaji: 'se', audioFile: `${KANA_AUDIO_BASE_PATH}/se.mp3` },
  so: { romaji: 'so', audioFile: `${KANA_AUDIO_BASE_PATH}/so.mp3` },
  ta: { romaji: 'ta', audioFile: `${KANA_AUDIO_BASE_PATH}/ta.mp3` },
  chi: { romaji: 'chi', audioFile: `${KANA_AUDIO_BASE_PATH}/chi.mp3` },
  tsu: { romaji: 'tsu', audioFile: `${KANA_AUDIO_BASE_PATH}/tsu.mp3` },
  te: { romaji: 'te', audioFile: `${KANA_AUDIO_BASE_PATH}/te.mp3` },
  to: { romaji: 'to', audioFile: `${KANA_AUDIO_BASE_PATH}/to.mp3` },
  na: { romaji: 'na', audioFile: `${KANA_AUDIO_BASE_PATH}/na.mp3` },
  ni: { romaji: 'ni', audioFile: `${KANA_AUDIO_BASE_PATH}/ni.mp3` },
  nu: { romaji: 'nu', audioFile: `${KANA_AUDIO_BASE_PATH}/nu.mp3` },
  ne: { romaji: 'ne', audioFile: `${KANA_AUDIO_BASE_PATH}/ne.mp3` },
  no: { romaji: 'no', audioFile: `${KANA_AUDIO_BASE_PATH}/no.mp3` },
  ha: { romaji: 'ha', audioFile: `${KANA_AUDIO_BASE_PATH}/ha.mp3` },
  hi: { romaji: 'hi', audioFile: `${KANA_AUDIO_BASE_PATH}/hi.mp3` },
  fu: { romaji: 'fu', audioFile: `${KANA_AUDIO_BASE_PATH}/fu.mp3` },
  he: { romaji: 'he', audioFile: `${KANA_AUDIO_BASE_PATH}/he.mp3` },
  ho: { romaji: 'ho', audioFile: `${KANA_AUDIO_BASE_PATH}/ho.mp3` },
  ma: { romaji: 'ma', audioFile: `${KANA_AUDIO_BASE_PATH}/ma.mp3` },
  mi: { romaji: 'mi', audioFile: `${KANA_AUDIO_BASE_PATH}/mi.mp3` },
  mu: { romaji: 'mu', audioFile: `${KANA_AUDIO_BASE_PATH}/mu.mp3` },
  me: { romaji: 'me', audioFile: `${KANA_AUDIO_BASE_PATH}/me.mp3` },
  mo: { romaji: 'mo', audioFile: `${KANA_AUDIO_BASE_PATH}/mo.mp3` },
  ya: { romaji: 'ya', audioFile: `${KANA_AUDIO_BASE_PATH}/ya.mp3` },
  yu: { romaji: 'yu', audioFile: `${KANA_AUDIO_BASE_PATH}/yu.mp3` },
  yo: { romaji: 'yo', audioFile: `${KANA_AUDIO_BASE_PATH}/yo.mp3` },
  ra: { romaji: 'ra', audioFile: `${KANA_AUDIO_BASE_PATH}/ra.mp3` },
  ri: { romaji: 'ri', audioFile: `${KANA_AUDIO_BASE_PATH}/ri.mp3` },
  ru: { romaji: 'ru', audioFile: `${KANA_AUDIO_BASE_PATH}/ru.mp3` },
  re: { romaji: 're', audioFile: `${KANA_AUDIO_BASE_PATH}/re.mp3` },
  ro: { romaji: 'ro', audioFile: `${KANA_AUDIO_BASE_PATH}/ro.mp3` },
  wa: { romaji: 'wa', audioFile: `${KANA_AUDIO_BASE_PATH}/wa.mp3` },
  wo: { romaji: 'wo', audioFile: `${KANA_AUDIO_BASE_PATH}/wo.mp3` },
  n: { romaji: 'n', audioFile: `${KANA_AUDIO_BASE_PATH}/n.mp3` },
  // Dakuten (voiced consonants)
  ga: { romaji: 'ga', audioFile: `${KANA_AUDIO_BASE_PATH}/ga.mp3` },
  gi: { romaji: 'gi', audioFile: `${KANA_AUDIO_BASE_PATH}/gi.mp3` },
  gu: { romaji: 'gu', audioFile: `${KANA_AUDIO_BASE_PATH}/gu.mp3` },
  ge: { romaji: 'ge', audioFile: `${KANA_AUDIO_BASE_PATH}/ge.mp3` },
  go: { romaji: 'go', audioFile: `${KANA_AUDIO_BASE_PATH}/go.mp3` },
  za: { romaji: 'za', audioFile: `${KANA_AUDIO_BASE_PATH}/za.mp3` },
  ji: { romaji: 'ji', audioFile: `${KANA_AUDIO_BASE_PATH}/ji.mp3` },
  zu: { romaji: 'zu', audioFile: `${KANA_AUDIO_BASE_PATH}/zu.mp3` },
  ze: { romaji: 'ze', audioFile: `${KANA_AUDIO_BASE_PATH}/ze.mp3` },
  zo: { romaji: 'zo', audioFile: `${KANA_AUDIO_BASE_PATH}/zo.mp3` },
  da: { romaji: 'da', audioFile: `${KANA_AUDIO_BASE_PATH}/da.mp3` },
  di: { romaji: 'di', audioFile: `${KANA_AUDIO_BASE_PATH}/di.mp3` },
  du: { romaji: 'du', audioFile: `${KANA_AUDIO_BASE_PATH}/du.mp3` },
  de: { romaji: 'de', audioFile: `${KANA_AUDIO_BASE_PATH}/de.mp3` },
  do: { romaji: 'do', audioFile: `${KANA_AUDIO_BASE_PATH}/do.mp3` },
  ba: { romaji: 'ba', audioFile: `${KANA_AUDIO_BASE_PATH}/ba.mp3` },
  bi: { romaji: 'bi', audioFile: `${KANA_AUDIO_BASE_PATH}/bi.mp3` },
  bu: { romaji: 'bu', audioFile: `${KANA_AUDIO_BASE_PATH}/bu.mp3` },
  be: { romaji: 'be', audioFile: `${KANA_AUDIO_BASE_PATH}/be.mp3` },
  bo: { romaji: 'bo', audioFile: `${KANA_AUDIO_BASE_PATH}/bo.mp3` },
  // Handakuten (p-sounds)
  pa: { romaji: 'pa', audioFile: `${KANA_AUDIO_BASE_PATH}/pa.mp3` },
  pi: { romaji: 'pi', audioFile: `${KANA_AUDIO_BASE_PATH}/pi.mp3` },
  pu: { romaji: 'pu', audioFile: `${KANA_AUDIO_BASE_PATH}/pu.mp3` },
  pe: { romaji: 'pe', audioFile: `${KANA_AUDIO_BASE_PATH}/pe.mp3` },
  po: { romaji: 'po', audioFile: `${KANA_AUDIO_BASE_PATH}/po.mp3` },
};

export function getKanaAudioPath(romaji: string): string | null {
  return KANA_AUDIO[romaji]?.audioFile || null;
}
