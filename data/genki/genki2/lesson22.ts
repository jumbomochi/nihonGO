import { GenkiLesson } from '@/types/genki';
import { generateLessonAudioTracks } from '../audio/audioManifest';

export const lesson22: GenkiLesson = {
  id: 'genki2-lesson22',
  book: 'genki2',
  lessonNumber: 22,
  title: 'Education in Japan',
  titleJapanese: '日本の教育',
  description:
    'Learn to express reasoning, expectations, and explanations using advanced grammar patterns.',
  objectives: [
    'Express explanations and reasoning with ～わけ',
    'State expectations with ～はず',
    'Use ～ようにする to express efforts',
    'Discuss education and social issues',
    'Express regret with ～ばよかった',
  ],
  estimatedMinutes: 90,
  sections: [
    {
      id: 'l22-dialogue',
      type: 'dialogue',
      title: 'Dialogue',
      titleJapanese: 'かいわ',
      content: {
        dialogue: {
          id: 'l22-d01',
          title: 'The Japanese Education System',
          titleJapanese: '日本の学校',
          context: 'Mary asks her Japanese friend about the education system in Japan.',
          characters: ['Mary', 'Friend'],
          lines: [
            {
              speaker: 'Mary',
              japanese: '日本の学校はたいへんだって聞いたけど、本当？',
              reading: 'にほんのがっこうはたいへんだってきいたけど、ほんとう？',
              english: 'I heard Japanese schools are tough. Is that true?',
            },
            {
              speaker: 'Friend',
              japanese: 'うん、じゅけんがあるからね。いい大学に入らないと、いい会社に就職できないわけ。',
              reading: 'うん、じゅけんがあるからね。いいだいがくにはいらないと、いいかいしゃにしゅうしょくできないわけ。',
              english: "Yeah, because of entrance exams. If you don't get into a good university, you can't get a job at a good company—that's the reasoning.",
            },
            {
              speaker: 'Mary',
              japanese: 'それで、みんなじゅくに行くわけね。',
              reading: 'それで、みんなじゅくにいくわけね。',
              english: "So that's why everyone goes to cram school.",
            },
            {
              speaker: 'Friend',
              japanese: 'そう。でも、さいきんは変わってきてるはずだよ。',
              reading: 'そう。でも、さいきんはかわってきてるはずだよ。',
              english: 'Right. But recently it should be changing.',
            },
            {
              speaker: 'Mary',
              japanese: 'どういうふうに？',
              reading: 'どういうふうに？',
              english: 'In what way?',
            },
            {
              speaker: 'Friend',
              japanese: '学歴だけじゃなくて、けいけんやスキルも大切にされるようになってきた。',
              reading: 'がくれきだけじゃなくて、けいけんやすきるもたいせつにされるようになってきた。',
              english: 'Not just academic background, but experience and skills have come to be valued too.',
            },
          ],
        },
      },
    },
    {
      id: 'l22-vocab',
      type: 'vocabulary',
      title: 'Vocabulary',
      titleJapanese: 'たんご',
      content: {
        vocabulary: [
          { id: 'l22-v01', japanese: '教育', reading: 'きょういく', romaji: 'kyouiku', english: 'education', partOfSpeech: 'noun' },
          { id: 'l22-v02', japanese: '受験', reading: 'じゅけん', romaji: 'juken', english: 'entrance examination', partOfSpeech: 'noun' },
          { id: 'l22-v03', japanese: '入学', reading: 'にゅうがく', romaji: 'nyuugaku', english: 'entering school; enrollment', partOfSpeech: 'noun' },
          { id: 'l22-v04', japanese: '卒業', reading: 'そつぎょう', romaji: 'sotsugyou', english: 'graduation', partOfSpeech: 'noun' },
          { id: 'l22-v05', japanese: '塾', reading: 'じゅく', romaji: 'juku', english: 'cram school', partOfSpeech: 'noun' },
          { id: 'l22-v06', japanese: '学歴', reading: 'がくれき', romaji: 'gakureki', english: 'educational background', partOfSpeech: 'noun' },
          { id: 'l22-v07', japanese: '就職', reading: 'しゅうしょく', romaji: 'shuushoku', english: 'finding employment', partOfSpeech: 'noun' },
          { id: 'l22-v08', japanese: '奨学金', reading: 'しょうがくきん', romaji: 'shougakukin', english: 'scholarship', partOfSpeech: 'noun' },
          { id: 'l22-v09', japanese: '受ける', reading: 'うける', romaji: 'ukeru', english: 'to take (an exam); to receive', partOfSpeech: 'verb', category: 'Verbs (る-verbs)' },
          { id: 'l22-v10', japanese: '受かる', reading: 'うかる', romaji: 'ukaru', english: 'to pass (an exam)', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l22-v11', japanese: '落ちる', reading: 'おちる', romaji: 'ochiru', english: 'to fail (an exam); to fall', partOfSpeech: 'verb', category: 'Verbs (る-verbs)' },
          { id: 'l22-v12', japanese: '暗記する', reading: 'あんきする', romaji: 'anki suru', english: 'to memorize', partOfSpeech: 'verb', category: 'Verbs (する)' },
          { id: 'l22-v13', japanese: '復習する', reading: 'ふくしゅうする', romaji: 'fukushuu suru', english: 'to review', partOfSpeech: 'verb', category: 'Verbs (する)' },
          { id: 'l22-v14', japanese: '予習する', reading: 'よしゅうする', romaji: 'yoshuu suru', english: 'to prepare for class', partOfSpeech: 'verb', category: 'Verbs (する)' },
          { id: 'l22-v15', japanese: '厳しい', reading: 'きびしい', romaji: 'kibishii', english: 'strict; harsh', partOfSpeech: 'i-adjective' },
          { id: 'l22-v16', japanese: '必要', reading: 'ひつよう', romaji: 'hitsuyou', english: 'necessary; needed', partOfSpeech: 'na-adjective' },
          { id: 'l22-v17', japanese: '確か', reading: 'たしか', romaji: 'tashika', english: 'certain; if I remember correctly', partOfSpeech: 'na-adjective' },
          { id: 'l22-v18', japanese: '結局', reading: 'けっきょく', romaji: 'kekkyoku', english: 'in the end; after all', partOfSpeech: 'adverb' },
          { id: 'l22-v19', japanese: 'せっかく', reading: 'せっかく', romaji: 'sekkaku', english: 'with much effort; specially', partOfSpeech: 'adverb' },
        ],
      },
    },
    {
      id: 'l22-grammar',
      type: 'grammar',
      title: 'Grammar',
      titleJapanese: 'ぶんぽう',
      content: {
        grammar: [
          {
            id: 'l22-g01',
            title: '〜わけだ',
            pattern: 'Plain form + わけだ',
            explanation:
              '～わけだ draws a logical conclusion or explains a reason. It indicates "given the situation, it makes sense that..."',
            culturalNote:
              '～わけね is often used to show understanding.',
            examples: [
              {
                japanese: '雨がふっていた。だから、試合がちゅうしになったわけだ。',
                reading: 'あめがふっていた。だから、しあいがちゅうしになったわけだ。',
                english: "It was raining. So that's why the game was canceled.",
              },
              {
                japanese: '日本に5年いたから、日本語がじょうずなわけだ。',
                reading: 'にほんにごねんいたから、にほんごがじょうずなわけだ。',
                english: "Since you were in Japan for 5 years, that's why your Japanese is good.",
              },
            ],
          },
          {
            id: 'l22-g02',
            title: '〜わけではない / 〜わけがない',
            pattern: 'Plain form + わけではない/わけがない',
            explanation:
              '～わけではない softly denies something. ～わけがない strongly denies possibility (there\'s no way...).',
            culturalNote:
              'These forms allow for indirect disagreement, valued in Japanese communication.',
            examples: [
              {
                japanese: '日本が好きじゃないわけではありません。',
                reading: 'にほんがすきじゃないわけではありません。',
                english: "It's not that I don't like Japan.",
              },
              {
                japanese: 'かんたんにできるわけがない。',
                reading: 'かんたんにできるわけがない。',
                english: "There's no way it can be done easily.",
              },
            ],
          },
          {
            id: 'l22-g03',
            title: '〜はずだ',
            pattern: 'Plain form + はずだ',
            explanation:
              '～はず expresses an expectation based on information or reasoning. Different from ～べき (moral obligation). はずがない means "there\'s no way that..."',
            culturalNote:
              '～はずだったのに expresses disappointment when expectations weren\'t met.',
            examples: [
              {
                japanese: '電車は5時に着くはずです。',
                reading: 'でんしゃはごじにつくはずです。',
                english: 'The train should arrive at 5.',
              },
              {
                japanese: 'かれは来ないはずです。',
                reading: 'かれはこないはずです。',
                english: "He shouldn't come.",
              },
            ],
          },
          {
            id: 'l22-g04',
            title: '〜ようにする',
            pattern: 'Dictionary form / ない form + ようにする',
            explanation:
              '～ようにする expresses making an effort to do/not do something. ～ようにしている describes an ongoing effort or habit.',
            culturalNote:
              'Useful for talking about health habits, study routines, and self-improvement.',
            examples: [
              {
                japanese: '毎日日本語をべんきょうするようにしています。',
                reading: 'まいにちにほんごをべんきょうするようにしています。',
                english: 'I try to study Japanese every day.',
              },
              {
                japanese: 'おくれないようにします。',
                reading: 'おくれないようにします。',
                english: 'I will make sure not to be late.',
              },
            ],
          },
          {
            id: 'l22-g05',
            title: '〜ようになる',
            pattern: 'Dictionary form / ない form + ようになる',
            explanation:
              '～ようになる describes a gradual change in ability or habit. It focuses on the result of change rather than the effort.',
            culturalNote:
              'Commonly used to describe language learning progress.',
            examples: [
              {
                japanese: '日本語が話せるようになりました。',
                reading: 'にほんごがはなせるようになりました。',
                english: 'I have become able to speak Japanese.',
              },
              {
                japanese: '早くおきられるようになった。',
                reading: 'はやくおきられるようになった。',
                english: 'I have become able to wake up early.',
              },
            ],
          },
          {
            id: 'l22-g06',
            title: '〜ばよかった / 〜たらよかった',
            pattern: 'ば-form/たら + よかった',
            explanation:
              '～ばよかった / ～たらよかった expresses regret about a past action that wasn\'t taken.',
            culturalNote:
              'Japanese has many ways to express regret, reflecting the cultural importance of reflection.',
            examples: [
              {
                japanese: 'もっとべんきょうすればよかった。',
                reading: 'もっとべんきょうすればよかった。',
                english: 'I wish I had studied more.',
              },
              {
                japanese: '早くおきたらよかったのに。',
                reading: 'はやくおきたらよかったのに。',
                english: 'I should have woken up early.',
              },
            ],
          },
        ],
      },
    },
    {
      id: 'l22-culture',
      type: 'culture',
      title: 'Culture Note',
      titleJapanese: 'ぶんかノート',
      content: {
        culturalNote: {
          id: 'l22-c01',
          title: 'The Japanese Education System',
          content:
            'Japanese education consists of elementary school (6 years), middle school (3 years), high school (3 years), and university (4 years). The intense focus on entrance exams (受験) shapes much of students\' lives, with many attending cram schools (塾) after regular school. The phrase "四当五落" (pass with 4 hours sleep, fail with 5) reflects the intense study culture. Historically, the university you attended significantly determined your career prospects.',
          relatedLesson: 'genki2-lesson22',
        },
      },
    },
  ],
  audioTracks: generateLessonAudioTracks('genki2', 22, 18),
};
