import { GenkiLesson } from '@/types/genki';
import { generateLessonAudioTracks } from '../audio/audioManifest';

export const lesson20: GenkiLesson = {
  id: 'genki2-lesson20',
  book: 'genki2',
  lessonNumber: 20,
  title: 'Mary Goes Shopping',
  titleJapanese: 'メアリーの買い物',
  description:
    'Learn humble language (謙譲語) to politely lower your own actions when speaking to or about others.',
  objectives: [
    'Use humble language (謙譲語) appropriately',
    'Master special humble verb forms',
    'Create humble forms using お〜する',
    'Understand when to use humble vs. respectful language',
    'Apply keigo correctly in shopping and service situations',
  ],
  estimatedMinutes: 100,
  sections: [
    {
      id: 'l20-dialogue',
      type: 'dialogue',
      title: 'Dialogue',
      titleJapanese: 'かいわ',
      content: {
        dialogue: {
          id: 'l20-d01',
          title: 'At a Department Store',
          titleJapanese: 'デパートで',
          context: 'Mary is shopping at a department store and talking with a sales clerk.',
          characters: ['Sales Clerk', 'Mary'],
          lines: [
            {
              speaker: 'Sales Clerk',
              japanese: 'いらっしゃいませ。何かおさがしですか。',
              reading: 'いらっしゃいませ。なにかおさがしですか。',
              english: 'Welcome. Are you looking for something?',
            },
            {
              speaker: 'Mary',
              japanese: 'はい、母へのプレゼントをさがしているのですが。',
              reading: 'はい、ははへのぷれぜんとをさがしているのですが。',
              english: "Yes, I'm looking for a present for my mother.",
            },
            {
              speaker: 'Sales Clerk',
              japanese: 'さようでございますか。どのようなものをおかんがえでしょうか。',
              reading: 'さようでございますか。どのようなものをおかんがえでしょうか。',
              english: 'I see. What kind of thing are you thinking of?',
            },
            {
              speaker: 'Mary',
              japanese: 'スカーフかばんか、そのへんを見せていただけますか。',
              reading: 'すかーふかばんか、そのへんをみせていただけますか。',
              english: 'Could you show me scarves or bags, something like that?',
            },
            {
              speaker: 'Sales Clerk',
              japanese: 'かしこまりました。こちらへどうぞ。ご案内いたします。',
              reading: 'かしこまりました。こちらへどうぞ。ごあんないいたします。',
              english: 'Certainly. This way, please. I will guide you.',
            },
            {
              speaker: 'Mary',
              japanese: 'じゃあ、これをいただきます。',
              reading: 'じゃあ、これをいただきます。',
              english: "Then I'll take this one.",
            },
          ],
        },
      },
    },
    {
      id: 'l20-vocab',
      type: 'vocabulary',
      title: 'Vocabulary',
      titleJapanese: 'たんご',
      content: {
        vocabulary: [
          { id: 'l20-v01', japanese: 'デパート', reading: 'でぱーと', romaji: 'depaato', english: 'department store', partOfSpeech: 'noun' },
          { id: 'l20-v02', japanese: '店員', reading: 'てんいん', romaji: 'tenin', english: 'store clerk', partOfSpeech: 'noun' },
          { id: 'l20-v03', japanese: '売り場', reading: 'うりば', romaji: 'uriba', english: 'sales floor; department', partOfSpeech: 'noun' },
          { id: 'l20-v04', japanese: 'プレゼント', reading: 'ぷれぜんと', romaji: 'purezento', english: 'present; gift', partOfSpeech: 'noun' },
          { id: 'l20-v05', japanese: 'スカーフ', reading: 'すかーふ', romaji: 'sukaafu', english: 'scarf', partOfSpeech: 'noun' },
          { id: 'l20-v06', japanese: '財布', reading: 'さいふ', romaji: 'saifu', english: 'wallet', partOfSpeech: 'noun' },
          { id: 'l20-v07', japanese: 'レシート', reading: 'れしーと', romaji: 'reshiito', english: 'receipt', partOfSpeech: 'noun' },
          { id: 'l20-v08', japanese: 'いただく', reading: 'いただく', romaji: 'itadaku', english: 'to receive; to eat/drink (humble)', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l20-v09', japanese: 'さしあげる', reading: 'さしあげる', romaji: 'sashiageru', english: 'to give (humble)', partOfSpeech: 'verb', category: 'Verbs (る-verbs)' },
          { id: 'l20-v10', japanese: 'もうす', reading: 'もうす', romaji: 'mousu', english: 'to say; to be called (humble)', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l20-v11', japanese: 'いたす', reading: 'いたす', romaji: 'itasu', english: 'to do (humble)', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l20-v12', japanese: 'まいる', reading: 'まいる', romaji: 'mairu', english: 'to go; to come (humble)', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l20-v13', japanese: 'おる', reading: 'おる', romaji: 'oru', english: 'to be (humble)', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l20-v14', japanese: 'うかがう', reading: 'うかがう', romaji: 'ukagau', english: 'to ask; to visit; to hear (humble)', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l20-v15', japanese: 'はいけんする', reading: 'はいけんする', romaji: 'haiken suru', english: 'to look at; to see (humble)', partOfSpeech: 'verb', category: 'Verbs (する)' },
          { id: 'l20-v16', japanese: 'かしこまりました', reading: 'かしこまりました', romaji: 'kashikomarimashita', english: 'Certainly (formal acknowledgment)', partOfSpeech: 'expression' },
          { id: 'l20-v17', japanese: 'ございます', reading: 'ございます', romaji: 'gozaimasu', english: 'to be; to have (formal copula)', partOfSpeech: 'expression' },
          { id: 'l20-v18', japanese: 'おつり', reading: 'おつり', romaji: 'otsuri', english: 'change (money)', partOfSpeech: 'noun' },
          { id: 'l20-v19', japanese: '包む', reading: 'つつむ', romaji: 'tsutsumu', english: 'to wrap', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
        ],
      },
    },
    {
      id: 'l20-grammar',
      type: 'grammar',
      title: 'Grammar',
      titleJapanese: 'ぶんぽう',
      content: {
        grammar: [
          {
            id: 'l20-g01',
            title: 'Special Humble Verbs',
            pattern: 'Memorize special humble forms for common verbs',
            explanation:
              'Key humble verbs: 言う → もうす, 行く/来る → まいる, いる → おる, する → いたす, もらう/食べる/飲む → いただく, あげる → さしあげる, 見る → はいけんする, 聞く/訪問する → うかがう',
            culturalNote:
              'Using humble language for your own actions is as important as using respectful language for others.',
            examples: [
              {
                japanese: '山田ともうします。',
                reading: 'やまだともうします。',
                english: 'My name is Yamada.',
              },
              {
                japanese: 'あした会社にまいります。',
                reading: 'あしたかいしゃにまいります。',
                english: 'I will come to the office tomorrow.',
              },
            ],
          },
          {
            id: 'l20-g02',
            title: 'お〜する / ご〜する Pattern',
            pattern: 'お/ご + Verb stem + する',
            explanation:
              'This pattern works for most verbs. Use お for native Japanese verbs and ご for Sino-Japanese words. Cannot be used with する verbs directly.',
            culturalNote:
              'This form is extremely common in customer service.',
            examples: [
              {
                japanese: 'おにもつをおもちします。',
                reading: 'おにもつをおもちします。',
                english: 'I will carry your luggage.',
              },
              {
                japanese: 'ごあんないいたします。',
                reading: 'ごあんないいたします。',
                english: 'I will guide you.',
              },
            ],
          },
          {
            id: 'l20-g03',
            title: '〜ていただく Pattern',
            pattern: 'て-form + いただく',
            explanation:
              '～ていただく is the humble equivalent of ～てもらう. ～ていただけますか is a very polite way to make requests.',
            culturalNote:
              'This is the go-to pattern for making polite requests in formal situations.',
            examples: [
              {
                japanese: '先生に見ていただきました。',
                reading: 'せんせいにみていただきました。',
                english: 'I had the teacher look at it.',
              },
              {
                japanese: '教えていただけますか。',
                reading: 'おしえていただけますか。',
                english: 'Could you please teach me?',
              },
            ],
          },
          {
            id: 'l20-g04',
            title: '〜させていただく Pattern',
            pattern: 'Causative-て form + いただく',
            explanation:
              'This pattern is very formal and shows maximum humility. It literally means "I receive the favor of being allowed to do."',
            culturalNote:
              'Often used in business settings when asking permission.',
            examples: [
              {
                japanese: 'しょうかいさせていただきます。',
                reading: 'しょうかいさせていただきます。',
                english: 'Allow me to introduce myself.',
              },
              {
                japanese: 'せつめいさせていただきます。',
                reading: 'せつめいさせていただきます。',
                english: 'Allow me to explain.',
              },
            ],
          },
          {
            id: 'l20-g05',
            title: 'でございます',
            pattern: 'Noun/Na-adj + でございます',
            explanation:
              'でございます is the most formal form of です. Used extensively in customer service and formal business settings.',
            culturalNote:
              'You will hear でございます constantly in department stores, hotels, and upscale restaurants.',
            examples: [
              {
                japanese: 'こちらが会議室でございます。',
                reading: 'こちらがかいぎしつでございます。',
                english: 'This is the meeting room.',
              },
              {
                japanese: '5000円でございます。',
                reading: 'ごせんえんでございます。',
                english: 'It is 5000 yen.',
              },
            ],
          },
          {
            id: 'l20-g06',
            title: 'Uchi-Soto (In-group/Out-group)',
            pattern: 'Humble forms for anyone in your "uchi" when speaking to "soto"',
            explanation:
              'When speaking to people outside your group (soto), use humble language for everyone in your group (uchi), including superiors.',
            culturalNote:
              'The social boundary shifts depending on who you are talking to.',
            examples: [
              {
                japanese: '社長は会議中でございます。',
                reading: 'しゃちょうはかいぎちゅうでございます。',
                english: 'The president is in a meeting. (to customer)',
              },
              {
                japanese: '田中はただいまおりません。',
                reading: 'たなかはただいまおりません。',
                english: 'Tanaka is not here at the moment. (to outsider)',
              },
            ],
          },
        ],
      },
    },
    {
      id: 'l20-culture',
      type: 'culture',
      title: 'Culture Note',
      titleJapanese: 'ぶんかノート',
      content: {
        culturalNote: {
          id: 'l20-c01',
          title: 'Department Store Service',
          content:
            'Japanese department stores (デパート) are known for exceptional customer service. Clerks bow when stores open, use impeccable keigo, wrap purchases beautifully (often for free), and escort customers to elevators. Gift presentation is extremely important - stores offer complimentary gift wrapping (プレゼント用に包む) with elegant paper and ribbons. The wrapping often indicates the store\'s prestige.',
          relatedLesson: 'genki2-lesson20',
        },
      },
    },
  ],
  audioTracks: generateLessonAudioTracks('genki2', 20, 20),
};
