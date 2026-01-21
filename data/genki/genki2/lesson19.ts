import { GenkiLesson } from '@/types/genki';
import { generateLessonAudioTracks } from '../audio/audioManifest';

export const lesson19: GenkiLesson = {
  id: 'genki2-lesson19',
  book: 'genki2',
  lessonNumber: 19,
  title: 'Meeting and Greeting',
  titleJapanese: 'あいさつと出会い',
  description:
    'Learn respectful language (尊敬語) for speaking politely about the actions of others, especially superiors and customers.',
  objectives: [
    'Understand the concept of honorific language (敬語)',
    'Use respectful language (尊敬語) correctly',
    'Recognize special honorific verb forms',
    'Create respectful forms using お〜になる',
    'Apply appropriate language in business and formal settings',
  ],
  estimatedMinutes: 100,
  sections: [
    {
      id: 'l19-dialogue',
      type: 'dialogue',
      title: 'Dialogue',
      titleJapanese: 'かいわ',
      content: {
        dialogue: {
          id: 'l19-d01',
          title: 'At a Business Meeting',
          titleJapanese: 'かいぎで',
          context: 'A young employee speaks with a senior manager at a company meeting.',
          characters: ['Young Employee', 'Manager Yamada'],
          lines: [
            {
              speaker: 'Young Employee',
              japanese: 'しつれいします。山田部長、おいそがしいところ、すみません。',
              reading: 'しつれいします。やまだぶちょう、おいそがしいところ、すみません。',
              english: "Excuse me. Manager Yamada, I'm sorry to bother you when you're busy.",
            },
            {
              speaker: 'Manager Yamada',
              japanese: 'いいえ、いいですよ。どうぞおかけください。',
              reading: 'いいえ、いいですよ。どうぞおかけください。',
              english: "No, it's fine. Please have a seat.",
            },
            {
              speaker: 'Young Employee',
              japanese: 'ありがとうございます。先週のプロジェクトについてごそうだんしたいのですが。',
              reading: 'ありがとうございます。せんしゅうのぷろじぇくとについてごそうだんしたいのですが。',
              english: 'Thank you. I would like to consult with you about last week\'s project.',
            },
            {
              speaker: 'Manager Yamada',
              japanese: 'ああ、あのプロジェクトね。社長もごらんになりましたよ。',
              reading: 'ああ、あのぷろじぇくとね。しゃちょうもごらんになりましたよ。',
              english: 'Ah, that project. The president also looked at it.',
            },
            {
              speaker: 'Young Employee',
              japanese: 'そうですか。社長は何とおっしゃいましたか。',
              reading: 'そうですか。しゃちょうはなんとおっしゃいましたか。',
              english: 'Is that so? What did the president say?',
            },
            {
              speaker: 'Manager Yamada',
              japanese: 'とてもよくできているとおっしゃっていましたよ。',
              reading: 'とてもよくできているとおっしゃっていましたよ。',
              english: 'He said it was very well done.',
            },
          ],
        },
      },
    },
    {
      id: 'l19-vocab',
      type: 'vocabulary',
      title: 'Vocabulary',
      titleJapanese: 'たんご',
      content: {
        vocabulary: [
          { id: 'l19-v01', japanese: '部長', reading: 'ぶちょう', romaji: 'buchou', english: 'department manager', partOfSpeech: 'noun' },
          { id: 'l19-v02', japanese: '課長', reading: 'かちょう', romaji: 'kachou', english: 'section chief', partOfSpeech: 'noun' },
          { id: 'l19-v03', japanese: '社長', reading: 'しゃちょう', romaji: 'shachou', english: 'company president', partOfSpeech: 'noun' },
          { id: 'l19-v04', japanese: '社員', reading: 'しゃいん', romaji: 'shain', english: 'company employee', partOfSpeech: 'noun' },
          { id: 'l19-v05', japanese: '会議', reading: 'かいぎ', romaji: 'kaigi', english: 'meeting; conference', partOfSpeech: 'noun' },
          { id: 'l19-v06', japanese: '出張', reading: 'しゅっちょう', romaji: 'shucchou', english: 'business trip', partOfSpeech: 'noun' },
          { id: 'l19-v07', japanese: 'プロジェクト', reading: 'ぷろじぇくと', romaji: 'purojekuto', english: 'project', partOfSpeech: 'noun' },
          { id: 'l19-v08', japanese: '書類', reading: 'しょるい', romaji: 'shorui', english: 'documents', partOfSpeech: 'noun' },
          { id: 'l19-v09', japanese: '名刺', reading: 'めいし', romaji: 'meishi', english: 'business card', partOfSpeech: 'noun' },
          { id: 'l19-v10', japanese: 'いらっしゃる', reading: 'いらっしゃる', romaji: 'irassharu', english: 'to be; to go; to come (honorific)', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l19-v11', japanese: 'おっしゃる', reading: 'おっしゃる', romaji: 'ossharu', english: 'to say (honorific)', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l19-v12', japanese: 'ごらんになる', reading: 'ごらんになる', romaji: 'goran ni naru', english: 'to see; to look (honorific)', partOfSpeech: 'verb', category: 'Verbs (る-verbs)' },
          { id: 'l19-v13', japanese: 'めしあがる', reading: 'めしあがる', romaji: 'meshiagaru', english: 'to eat; to drink (honorific)', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l19-v14', japanese: 'おやすみになる', reading: 'おやすみになる', romaji: 'oyasumi ni naru', english: 'to sleep; to rest (honorific)', partOfSpeech: 'verb', category: 'Verbs (る-verbs)' },
          { id: 'l19-v15', japanese: 'ごぞんじ', reading: 'ごぞんじ', romaji: 'gozonji', english: 'to know (honorific)', partOfSpeech: 'noun' },
          { id: 'l19-v16', japanese: 'なさる', reading: 'なさる', romaji: 'nasaru', english: 'to do (honorific)', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l19-v17', japanese: 'くださる', reading: 'くださる', romaji: 'kudasaru', english: 'to give (honorific)', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l19-v18', japanese: 'しつれいする', reading: 'しつれいする', romaji: 'shitsurei suru', english: 'to be rude; excuse me', partOfSpeech: 'verb', category: 'Verbs (する)' },
          { id: 'l19-v19', japanese: 'おせわになる', reading: 'おせわになる', romaji: 'osewa ni naru', english: "to be in someone's care", partOfSpeech: 'expression' },
          { id: 'l19-v20', japanese: 'ていねい', reading: 'ていねい', romaji: 'teinei', english: 'polite; careful', partOfSpeech: 'na-adjective' },
        ],
      },
    },
    {
      id: 'l19-grammar',
      type: 'grammar',
      title: 'Grammar',
      titleJapanese: 'ぶんぽう',
      content: {
        grammar: [
          {
            id: 'l19-g01',
            title: 'Overview of 敬語 (Keigo)',
            pattern: 'Three types: 尊敬語, 謙譲語, 丁寧語',
            explanation:
              '尊敬語 (sonkeigo) elevates the actions of others. 謙譲語 (kenjougo) humbles your own actions. 丁寧語 (teineigo) is general polite speech (-ます/-です forms).',
            culturalNote:
              'Keigo reflects Japanese values of showing respect through language. Essential in business and formal situations.',
            examples: [
              {
                japanese: '先生が来られました。(尊敬語)',
                reading: 'せんせいがこられました。',
                english: 'The teacher came. (respectful)',
              },
              {
                japanese: '私がまいりました。(謙譲語)',
                reading: 'わたしがまいりました。',
                english: 'I came. (humble)',
              },
            ],
          },
          {
            id: 'l19-g02',
            title: 'Special Honorific Verbs',
            pattern: 'Memorize special forms for common verbs',
            explanation:
              'Key pairs: いる/行く/来る → いらっしゃる, 言う → おっしゃる, 食べる/飲む → めしあがる, 見る → ごらんになる, する → なさる',
            culturalNote:
              'These special verbs are used every day in customer service.',
            examples: [
              {
                japanese: '社長はもういらっしゃいますか。',
                reading: 'しゃちょうはもういらっしゃいますか。',
                english: 'Is the president here yet?',
              },
              {
                japanese: '何をめしあがりますか。',
                reading: 'なにをめしあがりますか。',
                english: 'What would you like to eat/drink?',
              },
            ],
          },
          {
            id: 'l19-g03',
            title: 'お〜になる Pattern',
            pattern: 'お + Verb stem + になる',
            explanation:
              'This pattern works for most Japanese verbs that don\'t have special honorific forms. Cannot be used with する verbs or foreign loan verbs.',
            culturalNote:
              'When in doubt about whether a special form exists, お〜になる is usually a safe choice.',
            examples: [
              {
                japanese: '先生はもうおかえりになりましたか。',
                reading: 'せんせいはもうおかえりになりましたか。',
                english: 'Has the teacher gone home already?',
              },
              {
                japanese: 'このほんをおよみになりましたか。',
                reading: 'このほんをおよみになりましたか。',
                english: 'Have you read this book?',
              },
            ],
          },
          {
            id: 'l19-g04',
            title: 'Passive as Respectful',
            pattern: 'Same conjugation as passive form',
            explanation:
              'The passive form (～れる/～られる) can be used as a mild form of respectful language. It is less formal than special verbs or お〜になる.',
            culturalNote:
              'This form is commonly heard in news broadcasts and formal announcements.',
            examples: [
              {
                japanese: '先生はもう来られましたか。',
                reading: 'せんせいはもうこられましたか。',
                english: 'Has the teacher come yet?',
              },
              {
                japanese: '社長はあした出発されます。',
                reading: 'しゃちょうはあしたしゅっぱつされます。',
                english: 'The president will depart tomorrow.',
              },
            ],
          },
          {
            id: 'l19-g05',
            title: 'Honorific Prefixes お/ご',
            pattern: 'お + Japanese word / ご + Sino-Japanese word',
            explanation:
              'Generally, お attaches to native Japanese words (和語) and ご attaches to Sino-Japanese words (漢語). There are many exceptions to memorize.',
            culturalNote:
              'Some words always take honorific prefixes: お茶 (tea), お金 (money), ご飯 (rice/meal).',
            examples: [
              {
                japanese: 'お名前はなんですか。',
                reading: 'おなまえはなんですか。',
                english: 'What is your name?',
              },
              {
                japanese: 'ごかぞくはおげんきですか。',
                reading: 'ごかぞくはおげんきですか。',
                english: 'Is your family well?',
              },
            ],
          },
          {
            id: 'l19-g06',
            title: 'Honorific Request お〜ください',
            pattern: 'お + Verb stem + ください',
            explanation:
              'This is a more polite way to make requests than ～てください. Common in customer service and formal situations.',
            culturalNote:
              'You will hear these phrases constantly in Japanese stores, restaurants, and offices.',
            examples: [
              {
                japanese: 'こちらにおかけください。',
                reading: 'こちらにおかけください。',
                english: 'Please have a seat here.',
              },
              {
                japanese: 'しょうしょうおまちください。',
                reading: 'しょうしょうおまちください。',
                english: 'Please wait a moment.',
              },
            ],
          },
        ],
      },
    },
    {
      id: 'l19-culture',
      type: 'culture',
      title: 'Culture Note',
      titleJapanese: 'ぶんかノート',
      content: {
        culturalNote: {
          id: 'l19-c01',
          title: 'The Importance of Keigo',
          content:
            'Keigo (敬語) is not just about grammar—it reflects Japanese social values of hierarchy, respect, and harmony. Using appropriate keigo shows awareness of social relationships and demonstrates education and professionalism. Business card exchange (名刺交換) is a ritualized practice - receive cards with both hands, study them carefully, and never write on them. This reflects the importance of titles and organizational hierarchy.',
          relatedLesson: 'genki2-lesson19',
        },
      },
    },
  ],
  audioTracks: generateLessonAudioTracks('genki2', 19, 20),
};
