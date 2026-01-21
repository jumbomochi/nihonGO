import { GenkiLesson } from '@/types/genki';
import { generateLessonAudioTracks } from '../audio/audioManifest';

export const lesson21: GenkiLesson = {
  id: 'genki2-lesson21',
  book: 'genki2',
  lessonNumber: 21,
  title: 'Burglar',
  titleJapanese: 'どろぼう',
  description:
    'Learn passive and causative constructions to describe what is done to someone and what someone makes/lets others do.',
  objectives: [
    'Understand and form passive sentences',
    'Express unfortunate events using passive',
    'Use causative to express making/letting someone do something',
    'Combine causative and passive for "being made to do"',
    'Distinguish between direct and indirect passive',
  ],
  estimatedMinutes: 100,
  sections: [
    {
      id: 'l21-dialogue',
      type: 'dialogue',
      title: 'Dialogue',
      titleJapanese: 'かいわ',
      content: {
        dialogue: {
          id: 'l21-d01',
          title: 'The Burglary',
          titleJapanese: 'どろぼうにはいられた',
          context: 'Takeshi talks to Mary about a break-in at his apartment.',
          characters: ['Mary', 'Takeshi'],
          lines: [
            {
              speaker: 'Mary',
              japanese: 'たけしさん、どうしたの？元気なさそうだけど。',
              reading: 'たけしさん、どうしたの？げんきなさそうだけど。',
              english: "Takeshi, what's wrong? You don't look well.",
            },
            {
              speaker: 'Takeshi',
              japanese: 'きのう、どろぼうにはいられたんだ。',
              reading: 'きのう、どろぼうにはいられたんだ。',
              english: 'I was burglarized yesterday.',
            },
            {
              speaker: 'Mary',
              japanese: 'えっ、本当？それは大へんだったね。何をとられたの？',
              reading: 'えっ、ほんとう？それはたいへんだったね。なにをとられたの？',
              english: "What? Really? That must have been terrible. What was taken?",
            },
            {
              speaker: 'Takeshi',
              japanese: 'パソコンとカメラをとられた。それに、へやをめちゃくちゃにされた。',
              reading: 'ぱそこんとかめらをとられた。それに、へやをめちゃくちゃにされた。',
              english: 'My computer and camera were taken. And my room was messed up.',
            },
            {
              speaker: 'Mary',
              japanese: 'ひどいね。けいさつにれんらくした？',
              reading: 'ひどいね。けいさつにれんらくした？',
              english: "That's awful. Did you contact the police?",
            },
            {
              speaker: 'Takeshi',
              japanese: 'うん、すぐ来てくれて、いろいろ聞かれた。',
              reading: 'うん、すぐきてくれて、いろいろきかれた。',
              english: 'Yes, they came right away and I was asked various questions.',
            },
          ],
        },
      },
    },
    {
      id: 'l21-vocab',
      type: 'vocabulary',
      title: 'Vocabulary',
      titleJapanese: 'たんご',
      content: {
        vocabulary: [
          { id: 'l21-v01', japanese: 'どろぼう', reading: 'どろぼう', romaji: 'dorobou', english: 'burglar; thief', partOfSpeech: 'noun' },
          { id: 'l21-v02', japanese: '警察', reading: 'けいさつ', romaji: 'keisatsu', english: 'police', partOfSpeech: 'noun' },
          { id: 'l21-v03', japanese: '犯人', reading: 'はんにん', romaji: 'hannin', english: 'criminal; culprit', partOfSpeech: 'noun' },
          { id: 'l21-v04', japanese: '事件', reading: 'じけん', romaji: 'jiken', english: 'incident; case; crime', partOfSpeech: 'noun' },
          { id: 'l21-v05', japanese: '被害', reading: 'ひがい', romaji: 'higai', english: 'damage; harm', partOfSpeech: 'noun' },
          { id: 'l21-v06', japanese: 'めちゃくちゃ', reading: 'めちゃくちゃ', romaji: 'mechakucha', english: 'mess; chaos', partOfSpeech: 'na-adjective' },
          { id: 'l21-v07', japanese: 'ぬすむ', reading: 'ぬすむ', romaji: 'nusumu', english: 'to steal', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l21-v08', japanese: 'こわす', reading: 'こわす', romaji: 'kowasu', english: 'to break; to destroy', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l21-v09', japanese: 'ふむ', reading: 'ふむ', romaji: 'fumu', english: 'to step on', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l21-v10', japanese: 'わらう', reading: 'わらう', romaji: 'warau', english: 'to laugh', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l21-v11', japanese: 'しかる', reading: 'しかる', romaji: 'shikaru', english: 'to scold', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l21-v12', japanese: 'ほめる', reading: 'ほめる', romaji: 'homeru', english: 'to praise', partOfSpeech: 'verb', category: 'Verbs (る-verbs)' },
          { id: 'l21-v13', japanese: 'つかまえる', reading: 'つかまえる', romaji: 'tsukamaeru', english: 'to catch; to arrest', partOfSpeech: 'verb', category: 'Verbs (る-verbs)' },
          { id: 'l21-v14', japanese: 'いじめる', reading: 'いじめる', romaji: 'ijimeru', english: 'to bully; to tease', partOfSpeech: 'verb', category: 'Verbs (る-verbs)' },
          { id: 'l21-v15', japanese: 'かわいそう', reading: 'かわいそう', romaji: 'kawaisou', english: 'pitiful; poor thing', partOfSpeech: 'na-adjective' },
          { id: 'l21-v16', japanese: 'しかたがない', reading: 'しかたがない', romaji: 'shikata ga nai', english: 'cannot be helped', partOfSpeech: 'expression' },
          { id: 'l21-v17', japanese: 'むりやり', reading: 'むりやり', romaji: 'muriyari', english: "forcibly; against one's will", partOfSpeech: 'adverb' },
          { id: 'l21-v18', japanese: 'こわい', reading: 'こわい', romaji: 'kowai', english: 'scary; afraid', partOfSpeech: 'i-adjective' },
        ],
      },
    },
    {
      id: 'l21-grammar',
      type: 'grammar',
      title: 'Grammar',
      titleJapanese: 'ぶんぽう',
      content: {
        grammar: [
          {
            id: 'l21-g01',
            title: 'Passive Form',
            pattern: 'う-verbs: -u → -areru; る-verbs: -ru → -rareru',
            explanation:
              'The passive form shows that the subject is affected by an action. The agent (doer) is marked with に. Pattern: Subject は Agent に Verb-passive.',
            culturalNote:
              'Japanese uses passive voice more frequently than English, especially to express that something negative happened.',
            examples: [
              {
                japanese: '私は先生にしかられました。',
                reading: 'わたしはせんせいにしかられました。',
                english: 'I was scolded by the teacher.',
              },
              {
                japanese: 'この本は多くの人に読まれています。',
                reading: 'このほんはおおくのひとによまれています。',
                english: 'This book is read by many people.',
              },
            ],
          },
          {
            id: 'l21-g02',
            title: 'Indirect Passive (Suffering Passive)',
            pattern: 'Same passive form with broader meaning',
            explanation:
              'Indirect passive (迷惑の受身) expresses that the subject was negatively affected, even if they weren\'t the direct object.',
            culturalNote:
              'This usage reflects the cultural tendency to express oneself as being affected by external forces.',
            examples: [
              {
                japanese: '電車で足をふまれた。',
                reading: 'でんしゃであしをふまれた。',
                english: 'I had my foot stepped on (on the train).',
              },
              {
                japanese: '雨にふられてぬれた。',
                reading: 'あめにふられてぬれた。',
                english: 'I got rained on and got wet.',
              },
            ],
          },
          {
            id: 'l21-g03',
            title: 'Causative Form',
            pattern: 'う-verbs: -u → -aseru; る-verbs: -ru → -saseru',
            explanation:
              'Causative can mean "make" (force) or "let" (allow). The person made/let to do uses を for intransitive verbs and に for transitive verbs.',
            culturalNote:
              'させていただく (to be allowed to do) is a super-polite form using causative.',
            examples: [
              {
                japanese: '母は子供にそうじをさせました。',
                reading: 'はははこどもにそうじをさせました。',
                english: 'The mother made the child clean.',
              },
              {
                japanese: '先生は学生を帰らせました。',
                reading: 'せんせいはがくせいをかえらせました。',
                english: 'The teacher let the students go home.',
              },
            ],
          },
          {
            id: 'l21-g04',
            title: 'Causative Request',
            pattern: 'Causative-て form + もらう/いただく',
            explanation:
              '～させてもらう/いただく is a polite way to request permission. It literally means "receive the favor of being let to do."',
            culturalNote:
              'This is an important pattern for politely requesting permission.',
            examples: [
              {
                japanese: '写真をとらせてもらえますか。',
                reading: 'しゃしんをとらせてもらえますか。',
                english: 'May I take a picture?',
              },
              {
                japanese: 'ちょっとやすませてください。',
                reading: 'ちょっとやすませてください。',
                english: 'Please let me rest a little.',
              },
            ],
          },
          {
            id: 'l21-g05',
            title: 'Causative-Passive Form',
            pattern: 'Causative stem + られる; Short form: -u → -asareru',
            explanation:
              'Causative-passive combines both forms to express being forced to do something. There\'s a contracted form for う-verbs.',
            culturalNote:
              'This form often carries negative connotations of being forced against one\'s will.',
            examples: [
              {
                japanese: '野菜を食べさせられました。',
                reading: 'やさいをたべさせられました。',
                english: 'I was made to eat vegetables.',
              },
              {
                japanese: '待たされました。',
                reading: 'またされました。',
                english: 'I was made to wait.',
              },
            ],
          },
          {
            id: 'l21-g06',
            title: 'Passive of Perception Verbs',
            pattern: 'Perception verb in passive form',
            explanation:
              '見られる (to be seen) and 聞かれる (to be asked/heard) are very common passive forms.',
            culturalNote:
              '"Seen" often implies being caught doing something, carrying a nuance of embarrassment.',
            examples: [
              {
                japanese: '先生に見られた。',
                reading: 'せんせいにみられた。',
                english: 'I was seen by the teacher.',
              },
              {
                japanese: '秘密を聞かれた。',
                reading: 'ひみつをきかれた。',
                english: 'My secret was heard.',
              },
            ],
          },
        ],
      },
    },
    {
      id: 'l21-culture',
      type: 'culture',
      title: 'Culture Note',
      titleJapanese: 'ぶんかノート',
      content: {
        culturalNote: {
          id: 'l21-c01',
          title: 'Passive Voice and Japanese Mentality',
          content:
            'Japan is known for its remarkably low crime rate, making burglaries relatively rare. Japanese uses passive voice more than English, particularly for expressing unfortunate events. This reflects a cultural tendency to view oneself as affected by external circumstances rather than as an active agent. The "suffering passive" (迷惑の受身) is uniquely Japanese and has no direct English equivalent.',
          relatedLesson: 'genki2-lesson21',
        },
      },
    },
  ],
  audioTracks: generateLessonAudioTracks('genki2', 21, 20),
};
