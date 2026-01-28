// JLPT N4 Unit 1: Exam Overview & Strategies (N4試験対策)
// Supplementary to Genki II - Focus on exam preparation

import type { JLPTUnit } from '../../types';

export const unit01: JLPTUnit = {
  id: 'n4-unit-01',
  level: 'N4',
  unitNumber: 1,
  theme: 'JLPT N4 Exam Overview & Strategies',
  themeJapanese: 'N4試験対策',
  description: 'Master JLPT N4 exam format, test-taking strategies, and key terminology. Building on N5 knowledge to tackle intermediate-level challenges.',
  sections: {
    vocabulary: [
      // Test format terminology
      {
        id: 'n4-u01-v01',
        word: '長文',
        reading: 'ちょうぶん',
        meaning: 'long text/passage',
        partOfSpeech: 'noun',
        exampleSentence: 'N4の読解には長文問題があります。',
        exampleReading: 'えぬよんのどっかいにはちょうぶんもんだいがあります。',
        exampleMeaning: 'The N4 reading section has long passage questions.',
        jlptLevel: 'N4',
        tags: ['exam', 'reading']
      },
      {
        id: 'n4-u01-v02',
        word: '文章',
        reading: 'ぶんしょう',
        meaning: 'sentence; text; composition',
        partOfSpeech: 'noun',
        exampleSentence: '文章を読んで質問に答えてください。',
        exampleReading: 'ぶんしょうをよんでしつもんにこたえてください。',
        exampleMeaning: 'Please read the text and answer the questions.',
        jlptLevel: 'N4',
        tags: ['exam', 'reading']
      },
      {
        id: 'n4-u01-v03',
        word: '内容',
        reading: 'ないよう',
        meaning: 'content; substance',
        partOfSpeech: 'noun',
        exampleSentence: '文章の内容に合っているものを選んでください。',
        exampleReading: 'ぶんしょうのないようにあっているものをえらんでください。',
        exampleMeaning: 'Please choose the one that matches the content of the text.',
        jlptLevel: 'N4',
        tags: ['exam', 'reading']
      },
      {
        id: 'n4-u01-v04',
        word: '理解',
        reading: 'りかい',
        meaning: 'understanding; comprehension',
        partOfSpeech: 'noun',
        exampleSentence: '文章の理解を確認する問題です。',
        exampleReading: 'ぶんしょうのりかいをかくにんするもんだいです。',
        exampleMeaning: 'This is a question to confirm understanding of the text.',
        jlptLevel: 'N4',
        tags: ['exam', 'study']
      },
      {
        id: 'n4-u01-v05',
        word: '要点',
        reading: 'ようてん',
        meaning: 'main point; gist',
        partOfSpeech: 'noun',
        exampleSentence: '長文の要点をつかむことが大切です。',
        exampleReading: 'ちょうぶんのようてんをつかむことがたいせつです。',
        exampleMeaning: 'It is important to grasp the main points of long passages.',
        jlptLevel: 'N4',
        tags: ['exam', 'strategy']
      },
      {
        id: 'n4-u01-v06',
        word: '選択肢',
        reading: 'せんたくし',
        meaning: 'multiple choice option',
        partOfSpeech: 'noun',
        exampleSentence: '四つの選択肢から正しい答えを選びます。',
        exampleReading: 'よっつのせんたくしからただしいこたえをえらびます。',
        exampleMeaning: 'Choose the correct answer from four options.',
        jlptLevel: 'N4',
        tags: ['exam', 'format']
      },
      {
        id: 'n4-u01-v07',
        word: '正解',
        reading: 'せいかい',
        meaning: 'correct answer',
        partOfSpeech: 'noun',
        exampleSentence: '正解は一つだけです。',
        exampleReading: 'せいかいはひとつだけです。',
        exampleMeaning: 'There is only one correct answer.',
        jlptLevel: 'N4',
        tags: ['exam']
      },
      {
        id: 'n4-u01-v08',
        word: '不正解',
        reading: 'ふせいかい',
        meaning: 'incorrect answer',
        partOfSpeech: 'noun',
        exampleSentence: '不正解の選択肢を消去法で消していきます。',
        exampleReading: 'ふせいかいのせんたくしをしょうきょほうでけしていきます。',
        exampleMeaning: 'Eliminate incorrect options through process of elimination.',
        jlptLevel: 'N4',
        tags: ['exam', 'strategy']
      },
      {
        id: 'n4-u01-v09',
        word: '配点',
        reading: 'はいてん',
        meaning: 'point allocation; scoring',
        partOfSpeech: 'noun',
        exampleSentence: '各問題の配点を確認してください。',
        exampleReading: 'かくもんだいのはいてんをかくにんしてください。',
        exampleMeaning: 'Please check the point allocation for each question.',
        jlptLevel: 'N4',
        tags: ['exam']
      },
      {
        id: 'n4-u01-v10',
        word: '合格',
        reading: 'ごうかく',
        meaning: 'passing (an exam)',
        partOfSpeech: 'noun',
        exampleSentence: 'N4に合格するには全体の50%以上が必要です。',
        exampleReading: 'えぬよんにごうかくするにはぜんたいのごじゅっぱーせんといじょうがひつようです。',
        exampleMeaning: 'To pass N4, you need over 50% overall.',
        jlptLevel: 'N4',
        tags: ['exam']
      },
      {
        id: 'n4-u01-v11',
        word: '不合格',
        reading: 'ふごうかく',
        meaning: 'failing (an exam)',
        partOfSpeech: 'noun',
        exampleSentence: '基準点に達しないと不合格になります。',
        exampleReading: 'きじゅんてんにたっしないとふごうかくになります。',
        exampleMeaning: 'You will fail if you do not reach the passing score.',
        jlptLevel: 'N4',
        tags: ['exam']
      },
      {
        id: 'n4-u01-v12',
        word: '基準',
        reading: 'きじゅん',
        meaning: 'standard; criteria',
        partOfSpeech: 'noun',
        exampleSentence: '合格の基準は毎年変わりません。',
        exampleReading: 'ごうかくのきじゅんはまいとしかわりません。',
        exampleMeaning: 'The passing criteria do not change every year.',
        jlptLevel: 'N4',
        tags: ['exam']
      },
      {
        id: 'n4-u01-v13',
        word: '制限時間',
        reading: 'せいげんじかん',
        meaning: 'time limit',
        partOfSpeech: 'noun',
        exampleSentence: '読解の制限時間は60分です。',
        exampleReading: 'どっかいのせいげんじかんはろくじゅっぷんです。',
        exampleMeaning: 'The time limit for reading comprehension is 60 minutes.',
        jlptLevel: 'N4',
        tags: ['exam', 'time']
      },
      {
        id: 'n4-u01-v14',
        word: '残り時間',
        reading: 'のこりじかん',
        meaning: 'remaining time',
        partOfSpeech: 'noun',
        exampleSentence: '残り時間を確認しながら解いてください。',
        exampleReading: 'のこりじかんをかくにんしながらといてください。',
        exampleMeaning: 'Please solve while checking the remaining time.',
        jlptLevel: 'N4',
        tags: ['exam', 'time', 'strategy']
      },
      {
        id: 'n4-u01-v15',
        word: '解答用紙',
        reading: 'かいとうようし',
        meaning: 'answer sheet',
        partOfSpeech: 'noun',
        exampleSentence: '解答用紙に名前を書いてください。',
        exampleReading: 'かいとうようしになまえをかいてください。',
        exampleMeaning: 'Please write your name on the answer sheet.',
        jlptLevel: 'N4',
        tags: ['exam']
      },
      {
        id: 'n4-u01-v16',
        word: '試験監督',
        reading: 'しけんかんとく',
        meaning: 'exam proctor',
        partOfSpeech: 'noun',
        exampleSentence: '試験監督の指示に従ってください。',
        exampleReading: 'しけんかんとくのしじにしたがってください。',
        exampleMeaning: 'Please follow the proctor\'s instructions.',
        jlptLevel: 'N4',
        tags: ['exam']
      },
      {
        id: 'n4-u01-v17',
        word: '受験番号',
        reading: 'じゅけんばんごう',
        meaning: 'examinee number',
        partOfSpeech: 'noun',
        exampleSentence: '受験番号を正しく記入してください。',
        exampleReading: 'じゅけんばんごうをただしくきにゅうしてください。',
        exampleMeaning: 'Please fill in your examinee number correctly.',
        jlptLevel: 'N4',
        tags: ['exam']
      },
      {
        id: 'n4-u01-v18',
        word: '記入',
        reading: 'きにゅう',
        meaning: 'entry; filling in',
        partOfSpeech: 'noun',
        exampleSentence: 'マークシートへの記入は丁寧にしてください。',
        exampleReading: 'まーくしーとへのきにゅうはていねいにしてください。',
        exampleMeaning: 'Please fill in the mark sheet carefully.',
        jlptLevel: 'N4',
        tags: ['exam']
      },
      {
        id: 'n4-u01-v19',
        word: '見直す',
        reading: 'みなおす',
        meaning: 'to review; to look over again',
        partOfSpeech: 'verb',
        exampleSentence: '時間があれば答えを見直してください。',
        exampleReading: 'じかんがあればこたえをみなおしてください。',
        exampleMeaning: 'If you have time, please review your answers.',
        jlptLevel: 'N4',
        tags: ['exam', 'strategy']
      },
      {
        id: 'n4-u01-v20',
        word: '確認する',
        reading: 'かくにんする',
        meaning: 'to confirm; to check',
        partOfSpeech: 'verb',
        exampleSentence: '解答を提出する前に確認してください。',
        exampleReading: 'かいとうをていしゅつするまえにかくにんしてください。',
        exampleMeaning: 'Please check before submitting your answers.',
        jlptLevel: 'N4',
        tags: ['exam', 'strategy']
      },
      {
        id: 'n4-u01-v21',
        word: '推測する',
        reading: 'すいそくする',
        meaning: 'to guess; to infer',
        partOfSpeech: 'verb',
        exampleSentence: '分からない単語は文脈から推測します。',
        exampleReading: 'わからないたんごはぶんみゃくからすいそくします。',
        exampleMeaning: 'Guess unknown words from context.',
        jlptLevel: 'N4',
        tags: ['exam', 'strategy']
      },
      {
        id: 'n4-u01-v22',
        word: '文脈',
        reading: 'ぶんみゃく',
        meaning: 'context',
        partOfSpeech: 'noun',
        exampleSentence: '文脈を理解することが大切です。',
        exampleReading: 'ぶんみゃくをりかいすることがたいせつです。',
        exampleMeaning: 'Understanding context is important.',
        jlptLevel: 'N4',
        tags: ['exam', 'reading']
      },
      {
        id: 'n4-u01-v23',
        word: '段落',
        reading: 'だんらく',
        meaning: 'paragraph',
        partOfSpeech: 'noun',
        exampleSentence: '各段落の最初の文に注目してください。',
        exampleReading: 'かくだんらくのさいしょのぶんにちゅうもくしてください。',
        exampleMeaning: 'Pay attention to the first sentence of each paragraph.',
        jlptLevel: 'N4',
        tags: ['exam', 'reading', 'strategy']
      },
      {
        id: 'n4-u01-v24',
        word: '要約',
        reading: 'ようやく',
        meaning: 'summary',
        partOfSpeech: 'noun',
        exampleSentence: '文章の要約を考えながら読みましょう。',
        exampleReading: 'ぶんしょうのようやくをかんがえながらよみましょう。',
        exampleMeaning: 'Read while thinking about the summary of the text.',
        jlptLevel: 'N4',
        tags: ['exam', 'reading']
      },
      {
        id: 'n4-u01-v25',
        word: '比較',
        reading: 'ひかく',
        meaning: 'comparison',
        partOfSpeech: 'noun',
        exampleSentence: '選択肢を比較して答えを選びます。',
        exampleReading: 'せんたくしをひかくしてこたえをえらびます。',
        exampleMeaning: 'Compare the options and choose the answer.',
        jlptLevel: 'N4',
        tags: ['exam', 'strategy']
      },
      {
        id: 'n4-u01-v26',
        word: '復習',
        reading: 'ふくしゅう',
        meaning: 'review; revision',
        partOfSpeech: 'noun',
        exampleSentence: '試験前に文法を復習してください。',
        exampleReading: 'しけんまえにぶんぽうをふくしゅうしてください。',
        exampleMeaning: 'Please review grammar before the exam.',
        jlptLevel: 'N4',
        tags: ['study']
      },
      {
        id: 'n4-u01-v27',
        word: '予習',
        reading: 'よしゅう',
        meaning: 'preparation; preview study',
        partOfSpeech: 'noun',
        exampleSentence: '試験の形式を予習しておきましょう。',
        exampleReading: 'しけんのけいしきをよしゅうしておきましょう。',
        exampleMeaning: 'Let\'s prepare by studying the exam format.',
        jlptLevel: 'N4',
        tags: ['study']
      },
      {
        id: 'n4-u01-v28',
        word: '暗記',
        reading: 'あんき',
        meaning: 'memorization',
        partOfSpeech: 'noun',
        exampleSentence: '単語は暗記だけでなく使い方も覚えましょう。',
        exampleReading: 'たんごはあんきだけでなくつかいかたもおぼえましょう。',
        exampleMeaning: 'Don\'t just memorize words; learn how to use them too.',
        jlptLevel: 'N4',
        tags: ['study', 'strategy']
      },
      {
        id: 'n4-u01-v29',
        word: '出題',
        reading: 'しゅつだい',
        meaning: 'exam question setting; questions posed',
        partOfSpeech: 'noun',
        exampleSentence: 'N4の出題範囲を確認しましょう。',
        exampleReading: 'えぬよんのしゅつだいはんいをかくにんしましょう。',
        exampleMeaning: 'Let\'s check the scope of N4 questions.',
        jlptLevel: 'N4',
        tags: ['exam']
      },
      {
        id: 'n4-u01-v30',
        word: '範囲',
        reading: 'はんい',
        meaning: 'range; scope',
        partOfSpeech: 'noun',
        exampleSentence: '試験の範囲は公式サイトで確認できます。',
        exampleReading: 'しけんのはんいはこうしきさいとでかくにんできます。',
        exampleMeaning: 'You can check the exam scope on the official website.',
        jlptLevel: 'N4',
        tags: ['exam']
      },
      {
        id: 'n4-u01-v31',
        word: '傾向',
        reading: 'けいこう',
        meaning: 'tendency; trend',
        partOfSpeech: 'noun',
        exampleSentence: '過去問で出題傾向を把握しましょう。',
        exampleReading: 'かこもんでしゅつだいけいこうをはあくしましょう。',
        exampleMeaning: 'Grasp question trends through past exams.',
        jlptLevel: 'N4',
        tags: ['exam', 'strategy']
      },
      {
        id: 'n4-u01-v32',
        word: '過去問',
        reading: 'かこもん',
        meaning: 'past exam questions',
        partOfSpeech: 'noun',
        exampleSentence: '過去問を解いて練習しましょう。',
        exampleReading: 'かこもんをといてれんしゅうしましょう。',
        exampleMeaning: 'Practice by solving past exam questions.',
        jlptLevel: 'N4',
        tags: ['exam', 'study']
      },
      {
        id: 'n4-u01-v33',
        word: '模擬試験',
        reading: 'もぎしけん',
        meaning: 'mock exam; practice test',
        partOfSpeech: 'noun',
        exampleSentence: '模擬試験で本番に備えましょう。',
        exampleReading: 'もぎしけんでほんばんにそなえましょう。',
        exampleMeaning: 'Prepare for the real exam with mock tests.',
        jlptLevel: 'N4',
        tags: ['exam', 'study']
      },
      {
        id: 'n4-u01-v34',
        word: '時間配分',
        reading: 'じかんはいぶん',
        meaning: 'time allocation',
        partOfSpeech: 'noun',
        exampleSentence: '時間配分を考えて解いてください。',
        exampleReading: 'じかんはいぶんをかんがえてといてください。',
        exampleMeaning: 'Solve while considering time allocation.',
        jlptLevel: 'N4',
        tags: ['exam', 'strategy']
      },
      {
        id: 'n4-u01-v35',
        word: '消去法',
        reading: 'しょうきょほう',
        meaning: 'process of elimination',
        partOfSpeech: 'noun',
        exampleSentence: '消去法で正解を見つけましょう。',
        exampleReading: 'しょうきょほうでせいかいをみつけましょう。',
        exampleMeaning: 'Find the correct answer through elimination.',
        jlptLevel: 'N4',
        tags: ['exam', 'strategy']
      }
    ],
    kanji: [
      {
        id: 'n4-u01-k01',
        character: '章',
        onYomi: ['ショウ'],
        kunYomi: [],
        meaning: 'chapter; badge',
        strokeCount: 11,
        jlptLevel: 'N4',
        commonWords: [
          { word: '文章', reading: 'ぶんしょう', meaning: 'sentence; text' },
          { word: '章', reading: 'しょう', meaning: 'chapter' }
        ],
        mnemonics: 'A standing person (立) speaking early (早) introduces a new chapter.',
        chineseNote: 'Same as Chinese 章 (zhāng). Meaning is similar.'
      },
      {
        id: 'n4-u01-k02',
        character: '節',
        onYomi: ['セツ', 'セチ'],
        kunYomi: ['ふし'],
        meaning: 'section; season; joint',
        strokeCount: 13,
        jlptLevel: 'N4',
        commonWords: [
          { word: '季節', reading: 'きせつ', meaning: 'season' },
          { word: '節約', reading: 'せつやく', meaning: 'economizing' }
        ],
        mnemonics: 'Bamboo (竹) with immediately (即) - bamboo has joints/sections.',
        chineseNote: 'Same as Chinese 節/节 (jié). Core meaning of joint/section preserved.'
      },
      {
        id: 'n4-u01-k03',
        character: '段',
        onYomi: ['ダン'],
        kunYomi: [],
        meaning: 'step; grade; stage',
        strokeCount: 9,
        jlptLevel: 'N4',
        commonWords: [
          { word: '段落', reading: 'だんらく', meaning: 'paragraph' },
          { word: '階段', reading: 'かいだん', meaning: 'stairs' },
          { word: '値段', reading: 'ねだん', meaning: 'price' }
        ],
        mnemonics: 'Weapon radical with steps - climbing stages like martial arts ranks.',
        chineseNote: 'Same as Chinese 段 (duàn). Meaning is essentially the same.'
      },
      {
        id: 'n4-u01-k04',
        character: '落',
        onYomi: ['ラク'],
        kunYomi: ['お.ちる', 'お.とす'],
        meaning: 'fall; drop',
        strokeCount: 12,
        jlptLevel: 'N4',
        commonWords: [
          { word: '段落', reading: 'だんらく', meaning: 'paragraph' },
          { word: '落ちる', reading: 'おちる', meaning: 'to fall' },
          { word: '落とす', reading: 'おとす', meaning: 'to drop' }
        ],
        mnemonics: 'Grass (艹) and water (氵) on each (各) leaf - leaves falling.',
        chineseNote: 'Same as Chinese 落 (luò). Meaning is the same.'
      },
      {
        id: 'n4-u01-k05',
        character: '要',
        onYomi: ['ヨウ'],
        kunYomi: ['い.る', 'かなめ'],
        meaning: 'need; main point; essential',
        strokeCount: 9,
        jlptLevel: 'N4',
        commonWords: [
          { word: '要点', reading: 'ようてん', meaning: 'main point' },
          { word: '必要', reading: 'ひつよう', meaning: 'necessary' },
          { word: '要約', reading: 'ようやく', meaning: 'summary' }
        ],
        mnemonics: 'A woman (女) covering west (西) - essential protection.',
        chineseNote: 'Same as Chinese 要 (yào). Primary meanings preserved.'
      },
      {
        id: 'n4-u01-k06',
        character: '約',
        onYomi: ['ヤク'],
        kunYomi: [],
        meaning: 'promise; approximately',
        strokeCount: 9,
        jlptLevel: 'N4',
        commonWords: [
          { word: '要約', reading: 'ようやく', meaning: 'summary' },
          { word: '約束', reading: 'やくそく', meaning: 'promise' },
          { word: '節約', reading: 'せつやく', meaning: 'economizing' }
        ],
        mnemonics: 'Thread (糸) with ladle (勺) - threads bound by promise.',
        chineseNote: 'Same as Chinese 約/约 (yuē). Meanings overlap significantly.'
      },
      {
        id: 'n4-u01-k07',
        character: '点',
        onYomi: ['テン'],
        kunYomi: ['つ.ける'],
        meaning: 'point; mark; score',
        strokeCount: 9,
        jlptLevel: 'N4',
        commonWords: [
          { word: '要点', reading: 'ようてん', meaning: 'main point' },
          { word: '点', reading: 'てん', meaning: 'point; score' },
          { word: '欠点', reading: 'けってん', meaning: 'flaw' }
        ],
        mnemonics: 'Fortune telling (占) with fire (灬) - burning points.',
        chineseNote: 'Same as Chinese 點/点 (diǎn). Meaning is the same.'
      },
      {
        id: 'n4-u01-k08',
        character: '比',
        onYomi: ['ヒ'],
        kunYomi: ['くら.べる'],
        meaning: 'compare; ratio',
        strokeCount: 4,
        jlptLevel: 'N4',
        commonWords: [
          { word: '比較', reading: 'ひかく', meaning: 'comparison' },
          { word: '比べる', reading: 'くらべる', meaning: 'to compare' }
        ],
        mnemonics: 'Two people sitting side by side - comparing.',
        chineseNote: 'Same as Chinese 比 (bǐ). Meaning is identical.'
      },
      {
        id: 'n4-u01-k09',
        character: '較',
        onYomi: ['カク'],
        kunYomi: [],
        meaning: 'contrast; compare',
        strokeCount: 13,
        jlptLevel: 'N4',
        commonWords: [
          { word: '比較', reading: 'ひかく', meaning: 'comparison' }
        ],
        mnemonics: 'Vehicle (車) and crossing (交) - vehicles compared at crossing.',
        chineseNote: 'Same as Chinese 較/较 (jiào). Used in comparison compounds.'
      },
      {
        id: 'n4-u01-k10',
        character: '確',
        onYomi: ['カク'],
        kunYomi: ['たし.か', 'たし.かめる'],
        meaning: 'certain; confirm',
        strokeCount: 15,
        jlptLevel: 'N4',
        commonWords: [
          { word: '確認', reading: 'かくにん', meaning: 'confirmation' },
          { word: '確かめる', reading: 'たしかめる', meaning: 'to confirm' },
          { word: '正確', reading: 'せいかく', meaning: 'accurate' }
        ],
        mnemonics: 'Stone (石) with bird (隹) - solid as a rock, certain.',
        chineseNote: 'Same as Chinese 確/确 (què). Meaning is the same.'
      },
      {
        id: 'n4-u01-k11',
        character: '認',
        onYomi: ['ニン'],
        kunYomi: ['みと.める'],
        meaning: 'recognize; acknowledge',
        strokeCount: 14,
        jlptLevel: 'N4',
        commonWords: [
          { word: '確認', reading: 'かくにん', meaning: 'confirmation' },
          { word: '認める', reading: 'みとめる', meaning: 'to recognize' }
        ],
        mnemonics: 'Words (言) with patience (忍) - patiently recognizing truth.',
        chineseNote: 'Same as Chinese 認/认 (rèn). Meaning preserved.'
      },
      {
        id: 'n4-u01-k12',
        character: '復',
        onYomi: ['フク'],
        kunYomi: [],
        meaning: 'return; repeat; review',
        strokeCount: 12,
        jlptLevel: 'N4',
        commonWords: [
          { word: '復習', reading: 'ふくしゅう', meaning: 'review' },
          { word: '回復', reading: 'かいふく', meaning: 'recovery' }
        ],
        mnemonics: 'Going (彳) and returning (复) - repetition for review.',
        chineseNote: 'Same as Chinese 復/复 (fù). Core meanings preserved.'
      }
    ],
    grammar: [
      {
        id: 'n4-u01-g01',
        pattern: '〜ようになる',
        patternReading: '〜ようになる',
        meaning: 'to come to; to become able to; to reach the point where',
        formation: 'Verb dictionary form + ようになる / Verb ない form + ようになる',
        explanation: 'Indicates a change in state or ability over time. Used to describe gradual changes or new abilities that develop. Very common in JLPT N4 reading passages describing personal growth or change.',
        examples: [
          {
            japanese: '日本語が話せるようになりました。',
            reading: 'にほんごがはなせるようになりました。',
            english: 'I have become able to speak Japanese.'
          },
          {
            japanese: '毎日運動するようになった。',
            reading: 'まいにちうんどうするようになった。',
            english: 'I started exercising every day.'
          },
          {
            japanese: '野菜を食べられるようになりました。',
            reading: 'やさいをたべられるようになりました。',
            english: 'I have become able to eat vegetables.'
          }
        ],
        notes: 'Often appears in N4 reading passages about lifestyle changes or personal development. Distinguish from ことになる which indicates decisions made by others.',
        similarPatterns: ['n4-u01-g02', 'n4-u01-g04'],
        jlptLevel: 'N4'
      },
      {
        id: 'n4-u01-g02',
        pattern: '〜ことになる',
        patternReading: '〜ことになる',
        meaning: 'it has been decided that; it turns out that',
        formation: 'Verb dictionary form + ことになる',
        explanation: 'Indicates a decision or arrangement that was made (often by others or external circumstances). The speaker presents the result without emphasizing their own role in the decision.',
        examples: [
          {
            japanese: '来月、日本に行くことになりました。',
            reading: 'らいげつ、にほんにいくことになりました。',
            english: 'It has been decided that I will go to Japan next month.'
          },
          {
            japanese: '新しい会社で働くことになった。',
            reading: 'あたらしいかいしゃではたらくことになった。',
            english: 'It turned out that I will work at a new company.'
          },
          {
            japanese: '会議は中止することになりました。',
            reading: 'かいぎはちゅうしすることになりました。',
            english: 'It has been decided to cancel the meeting.'
          }
        ],
        notes: 'Common in N4 for announcements and explaining situations. Contrast with ことにする where the speaker makes the decision.',
        similarPatterns: ['n4-u01-g03'],
        jlptLevel: 'N4'
      },
      {
        id: 'n4-u01-g03',
        pattern: '〜ことにする',
        patternReading: '〜ことにする',
        meaning: 'to decide to',
        formation: 'Verb dictionary form + ことにする / Verb ない form + ことにする',
        explanation: 'Indicates a decision made by the speaker or subject. Emphasizes personal choice and volition.',
        examples: [
          {
            japanese: '毎朝早く起きることにしました。',
            reading: 'まいあさはやくおきることにしました。',
            english: 'I decided to wake up early every morning.'
          },
          {
            japanese: 'お酒を飲まないことにした。',
            reading: 'おさけをのまないことにした。',
            english: 'I decided not to drink alcohol.'
          },
          {
            japanese: '来年、留学することにしました。',
            reading: 'らいねん、りゅうがくすることにしました。',
            english: 'I decided to study abroad next year.'
          }
        ],
        notes: 'N4 frequently tests the difference between ことにする (personal decision) and ことになる (external decision/result).',
        similarPatterns: ['n4-u01-g02'],
        jlptLevel: 'N4'
      },
      {
        id: 'n4-u01-g04',
        pattern: '〜ようにする',
        patternReading: '〜ようにする',
        meaning: 'to try to; to make sure to; to make an effort to',
        formation: 'Verb dictionary form + ようにする / Verb ない form + ようにする',
        explanation: 'Indicates making an effort or taking measures to achieve something. Often used for habits or ongoing efforts.',
        examples: [
          {
            japanese: '野菜を食べるようにしています。',
            reading: 'やさいをたべるようにしています。',
            english: 'I try to eat vegetables.'
          },
          {
            japanese: '遅刻しないようにしてください。',
            reading: 'ちこくしないようにしてください。',
            english: 'Please make sure not to be late.'
          },
          {
            japanese: '毎日復習するようにしましょう。',
            reading: 'まいにちふくしゅうするようにしましょう。',
            english: 'Let\'s make sure to review every day.'
          }
        ],
        notes: 'Frequently appears in N4 passages about health, study habits, and lifestyle advice. Contrast with ようになる (change of state).',
        similarPatterns: ['n4-u01-g01'],
        jlptLevel: 'N4'
      },
      {
        id: 'n4-u01-g05',
        pattern: '〜てしまう',
        patternReading: '〜てしまう',
        meaning: 'to end up doing; to do completely; (expresses regret)',
        formation: 'Verb て form + しまう (casual: ちゃう/じゃう)',
        explanation: 'Has two main uses: 1) Completion of an action (often with a sense of finality), 2) Expressing regret or that something happened unintentionally. Context determines the nuance.',
        examples: [
          {
            japanese: '宿題を忘れてしまいました。',
            reading: 'しゅくだいをわすれてしまいました。',
            english: 'I (unfortunately) forgot my homework.'
          },
          {
            japanese: '本を全部読んでしまった。',
            reading: 'ほんをぜんぶよんでしまった。',
            english: 'I finished reading the entire book.'
          },
          {
            japanese: '電車に乗り遅れてしまった。',
            reading: 'でんしゃにのりおくれてしまった。',
            english: 'I ended up missing the train.'
          }
        ],
        notes: 'Very common in N4 listening for expressing regret or mistakes. Casual forms: 〜ちゃう (てしまう) and 〜じゃう (でしまう) are frequently heard.',
        jlptLevel: 'N4'
      }
    ],
    reading: [
      {
        id: 'n4-u01-r01',
        title: 'JLPT N4 Test Format',
        titleJapanese: 'N4試験の形式',
        passage: `JLPT N4の試験について説明します。

N4の試験は「言語知識・読解」と「聴解」の二つの部分があります。「言語知識・読解」は110分で、「聴解」は約35分です。

「言語知識」では、漢字の読み方、言葉の意味、文法などが出ます。「読解」では、短い文章から長い文章まで色々な問題があります。文章を読んで、内容に合っている答えを選びます。

N4では、日常生活で使う基本的な日本語が理解できるかどうかを見ます。N5より長い文章を読むようになりますから、時間配分が大切です。

合格するためには、各部分で基準点以上を取ることが必要です。全体の点数だけでなく、どの部分も基準を超えないといけません。`,
        passageWithFurigana: `JLPT N4の試験[しけん]について説明[せつめい]します。

N4の試験[しけん]は「言語[げんご]知識[ちしき]・読解[どっかい]」と「聴解[ちょうかい]」の二[ふた]つの部分[ぶぶん]があります。「言語[げんご]知識[ちしき]・読解[どっかい]」は110分[ぷん]で、「聴解[ちょうかい]」は約[やく]35分[ふん]です。

「言語[げんご]知識[ちしき]」では、漢字[かんじ]の読[よ]み方[かた]、言葉[ことば]の意味[いみ]、文法[ぶんぽう]などが出[で]ます。「読解[どっかい]」では、短[みじか]い文章[ぶんしょう]から長[なが]い文章[ぶんしょう]まで色々[いろいろ]な問題[もんだい]があります。文章[ぶんしょう]を読[よ]んで、内容[ないよう]に合[あ]っている答[こた]えを選[えら]びます。

N4では、日常[にちじょう]生活[せいかつ]で使[つか]う基本的[きほんてき]な日本語[にほんご]が理解[りかい]できるかどうかを見[み]ます。N5より長[なが]い文章[ぶんしょう]を読[よ]むようになりますから、時間[じかん]配分[はいぶん]が大切[たいせつ]です。

合格[ごうかく]するためには、各[かく]部分[ぶぶん]で基準[きじゅん]点[てん]以上[いじょう]を取[と]ることが必要[ひつよう]です。全体[ぜんたい]の点数[てんすう]だけでなく、どの部分[ぶぶん]も基準[きじゅん]を超[こ]えないといけません。`,
        wordCount: 180,
        difficulty: 'medium',
        questions: [
          {
            id: 'n4-u01-r01-q01',
            question: 'N4の試験は全部でいくつの部分がありますか。',
            questionReading: 'えぬよんのしけんはぜんぶでいくつのぶぶんがありますか。',
            type: 'multiple-choice',
            options: ['一つ', '二つ', '三つ', '四つ'],
            correctIndex: 1,
            explanation: '文章に「二つの部分があります」と書いてあります。'
          },
          {
            id: 'n4-u01-r01-q02',
            question: '「言語知識・読解」の時間は何分ですか。',
            questionReading: '「げんごちしき・どっかい」のじかんはなんぷんですか。',
            type: 'multiple-choice',
            options: ['35分', '60分', '110分', '145分'],
            correctIndex: 2,
            explanation: '「言語知識・読解」は110分です。'
          },
          {
            id: 'n4-u01-r01-q03',
            question: 'N4に合格するために必要なことは何ですか。',
            questionReading: 'えぬよんにごうかくするためにひつようなことはなんですか。',
            type: 'multiple-choice',
            options: [
              '全体の点数だけ高ければいい',
              '各部分で基準点以上を取ること',
              '聴解だけ高い点を取ること',
              '読解だけできればいい'
            ],
            correctIndex: 1,
            explanation: '「各部分で基準点以上を取ることが必要」と書いてあります。'
          }
        ]
      },
      {
        id: 'n4-u01-r02',
        title: 'N4 Test-Taking Strategies',
        titleJapanese: 'N4試験対策',
        passage: `N4の試験で高い点を取るためのアドバイスです。

まず、時間配分を考えましょう。読解の問題は長いものがあるので、簡単な問題から解くようにしてください。分からない問題は飛ばして、後で戻ることにしましょう。

次に、消去法を使いましょう。正解が分からなくても、明らかに違う選択肢を消していけば、正解の可能性が高くなります。

聴解では、問題が始まる前に選択肢を読んでおくことが大切です。何を聞けばいいか分かっていると、大事な情報を聞き逃さないようになります。

最後に、答えを書く時間に注意してください。聴解では、聞きながら答えを選んでしまうと、次の問題を聞き逃してしまいます。メモを取って、後で解答用紙に書くようにしましょう。`,
        passageWithFurigana: `N4の試験[しけん]で高[たか]い点[てん]を取[と]るためのアドバイスです。

まず、時間[じかん]配分[はいぶん]を考[かんが]えましょう。読解[どっかい]の問題[もんだい]は長[なが]いものがあるので、簡単[かんたん]な問題[もんだい]から解[と]くようにしてください。分[わ]からない問題[もんだい]は飛[と]ばして、後[あと]で戻[もど]ることにしましょう。

次[つぎ]に、消去[しょうきょ]法[ほう]を使[つか]いましょう。正解[せいかい]が分[わ]からなくても、明[あき]らかに違[ちが]う選択肢[せんたくし]を消[け]していけば、正解[せいかい]の可能性[かのうせい]が高[たか]くなります。

聴解[ちょうかい]では、問題[もんだい]が始[はじ]まる前[まえ]に選択肢[せんたくし]を読[よ]んでおくことが大切[たいせつ]です。何[なに]を聞[き]けばいいか分[わ]かっていると、大事[だいじ]な情報[じょうほう]を聞[き]き逃[のが]さないようになります。

最後[さいご]に、答[こた]えを書[か]く時間[じかん]に注意[ちゅうい]してください。聴解[ちょうかい]では、聞[き]きながら答[こた]えを選[えら]んでしまうと、次[つぎ]の問題[もんだい]を聞[き]き逃[のが]してしまいます。メモを取[と]って、後[あと]で解答[かいとう]用紙[ようし]に書[か]くようにしましょう。`,
        wordCount: 200,
        difficulty: 'medium',
        questions: [
          {
            id: 'n4-u01-r02-q01',
            question: '読解の問題はどう解くといいですか。',
            questionReading: 'どっかいのもんだいはどうとくといいですか。',
            type: 'multiple-choice',
            options: [
              '長い問題から解く',
              '難しい問題から解く',
              '簡単な問題から解く',
              '最後の問題から解く'
            ],
            correctIndex: 2,
            explanation: '「簡単な問題から解くようにしてください」と書いてあります。'
          },
          {
            id: 'n4-u01-r02-q02',
            question: '聴解の前にすることは何ですか。',
            questionReading: 'ちょうかいのまえにすることはなんですか。',
            type: 'multiple-choice',
            options: [
              '答えを書く',
              '選択肢を読んでおく',
              'メモを取る',
              '休憩する'
            ],
            correctIndex: 1,
            explanation: '「問題が始まる前に選択肢を読んでおくことが大切」と書いてあります。'
          },
          {
            id: 'n4-u01-r02-q03',
            question: '消去法とは何ですか。',
            questionReading: 'しょうきょほうとはなんですか。',
            type: 'multiple-choice',
            options: [
              '全部の選択肢を選ぶこと',
              '最初の選択肢を選ぶこと',
              '間違いの選択肢を消していくこと',
              '答えを消すこと'
            ],
            correctIndex: 2,
            explanation: '「明らかに違う選択肢を消していけば、正解の可能性が高くなります」と説明があります。'
          }
        ]
      }
    ],
    listening: [
      {
        id: 'n4-u01-l01',
        title: 'Exam Instructions',
        titleJapanese: '試験の説明',
        transcript: `これから試験の説明をします。よく聞いてください。

試験は二つの部分があります。最初は「言語知識・読解」です。時間は110分です。次は「聴解」です。時間は約35分です。

問題用紙と解答用紙が配られます。解答用紙に受験番号と名前を書いてください。答えはマークシートに鉛筆で書いてください。ボールペンは使わないでください。

試験中、携帯電話は使えません。机の上には、鉛筆と消しゴムだけ置いてください。

何か質問がありますか。では、始めましょう。`,
        transcriptWithFurigana: `これから試験[しけん]の説明[せつめい]をします。よく聞[き]いてください。

試験[しけん]は二[ふた]つの部分[ぶぶん]があります。最初[さいしょ]は「言語[げんご]知識[ちしき]・読解[どっかい]」です。時間[じかん]は110分[ぷん]です。次[つぎ]は「聴解[ちょうかい]」です。時間[じかん]は約[やく]35分[ふん]です。

問題[もんだい]用紙[ようし]と解答[かいとう]用紙[ようし]が配[くば]られます。解答[かいとう]用紙[ようし]に受験[じゅけん]番号[ばんごう]と名前[なまえ]を書[か]いてください。答[こた]えはマークシートに鉛筆[えんぴつ]で書[か]いてください。ボールペンは使[つか]わないでください。

試験中[しけんちゅう]、携帯[けいたい]電話[でんわ]は使[つか]えません。机[つくえ]の上[うえ]には、鉛筆[えんぴつ]と消[け]しゴムだけ置[お]いてください。

何[なに]か質問[しつもん]がありますか。では、始[はじ]めましょう。`,
        duration: 60,
        difficulty: 'easy',
        speakers: ['試験監督'],
        questions: [
          {
            id: 'n4-u01-l01-q01',
            question: '解答用紙に何を書きますか。',
            questionReading: 'かいとうようしになにをかきますか。',
            type: 'multiple-choice',
            options: [
              '名前だけ',
              '受験番号だけ',
              '受験番号と名前',
              '住所と名前'
            ],
            correctIndex: 2,
            explanation: '「受験番号と名前を書いてください」と言っています。'
          },
          {
            id: 'n4-u01-l01-q02',
            question: '答えを書く時、何を使いますか。',
            questionReading: 'こたえをかくとき、なにをつかいますか。',
            type: 'multiple-choice',
            options: ['ボールペン', '鉛筆', 'シャープペンシル', 'マジック'],
            correctIndex: 1,
            explanation: '「鉛筆で書いてください」と言っています。'
          }
        ]
      },
      {
        id: 'n4-u01-l02',
        title: 'Study Advice',
        titleJapanese: '勉強のアドバイス',
        transcript: `先生：田中さん、N4の勉強はどうですか。

田中：読解が難しいです。長い文章を読むと時間がかかってしまいます。

先生：そうですか。では、毎日少しずつ読むようにしてください。最初は短い文章から始めて、だんだん長い文章が読めるようになりますよ。

田中：分かりました。あと、知らない単語がたくさんあって...

先生：分からない単語は、文脈から意味を推測するようにしましょう。全部の単語を知らなくても大丈夫です。大事なのは文章全体の要点をつかむことです。

田中：なるほど。やってみます。

先生：頑張ってください。過去問も解くようにするといいですよ。`,
        transcriptWithFurigana: `先生[せんせい]：田中[たなか]さん、N4の勉強[べんきょう]はどうですか。

田中[たなか]：読解[どっかい]が難[むずか]しいです。長[なが]い文章[ぶんしょう]を読[よ]むと時間[じかん]がかかってしまいます。

先生[せんせい]：そうですか。では、毎日[まいにち]少[すこ]しずつ読[よ]むようにしてください。最初[さいしょ]は短[みじか]い文章[ぶんしょう]から始[はじ]めて、だんだん長[なが]い文章[ぶんしょう]が読[よ]めるようになりますよ。

田中[たなか]：分[わ]かりました。あと、知[し]らない単語[たんご]がたくさんあって...

先生[せんせい]：分[わ]からない単語[たんご]は、文脈[ぶんみゃく]から意味[いみ]を推測[すいそく]するようにしましょう。全部[ぜんぶ]の単語[たんご]を知[し]らなくても大丈夫[だいじょうぶ]です。大事[だいじ]なのは文章[ぶんしょう]全体[ぜんたい]の要点[ようてん]をつかむことです。

田中[たなか]：なるほど。やってみます。

先生[せんせい]：頑張[がんば]ってください。過去[かこ]問[もん]も解[と]くようにするといいですよ。`,
        duration: 75,
        difficulty: 'medium',
        speakers: ['先生', '田中'],
        questions: [
          {
            id: 'n4-u01-l02-q01',
            question: '田中さんの問題は何ですか。',
            questionReading: 'たなかさんのもんだいはなんですか。',
            type: 'multiple-choice',
            options: [
              '聴解が難しい',
              '読解が難しい',
              '文法が難しい',
              '漢字が難しい'
            ],
            correctIndex: 1,
            explanation: '田中さんは「読解が難しいです」と言っています。'
          },
          {
            id: 'n4-u01-l02-q02',
            question: '先生のアドバイスで正しいのはどれですか。',
            questionReading: 'せんせいのアドバイスでただしいのはどれですか。',
            type: 'multiple-choice',
            options: [
              '全部の単語を覚える',
              '長い文章だけ読む',
              '文脈から意味を推測する',
              '辞書を使う'
            ],
            correctIndex: 2,
            explanation: '先生は「文脈から意味を推測するようにしましょう」と言っています。'
          },
          {
            id: 'n4-u01-l02-q03',
            question: '読解の勉強で大事なことは何ですか。',
            questionReading: 'どっかいのべんきょうでだいじなことはなんですか。',
            type: 'multiple-choice',
            options: [
              '速く読むこと',
              '要点をつかむこと',
              '声に出して読むこと',
              '何度も読むこと'
            ],
            correctIndex: 1,
            explanation: '先生は「大事なのは文章全体の要点をつかむこと」と言っています。'
          }
        ]
      }
    ]
  }
};
