import { JLPTUnit } from '../../types';

export const unit10: JLPTUnit = {
  id: 'n5-unit-10',
  level: 'N5',
  unitNumber: 10,
  theme: 'Basic Conversation',
  themeJapanese: '基本会話',
  description: 'Learn essential conversational expressions, polite phrases, and common situational vocabulary for everyday Japanese communication.',
  sections: {
    vocabulary: [
      // Polite expressions
      {
        id: 'n5-u10-v01',
        word: 'お願いします',
        reading: 'おねがいします',
        meaning: 'please (request)',
        partOfSpeech: 'expression',
        exampleSentence: 'これをお願いします。',
        exampleReading: 'これをおねがいします。',
        exampleMeaning: 'This one, please.',
        jlptLevel: 'N5',
        tags: ['polite', 'request'],
      },
      {
        id: 'n5-u10-v02',
        word: 'ごめんなさい',
        reading: 'ごめんなさい',
        meaning: 'I\'m sorry',
        partOfSpeech: 'expression',
        exampleSentence: 'ごめんなさい、遅くなりました。',
        exampleReading: 'ごめんなさい、おそくなりました。',
        exampleMeaning: 'I\'m sorry, I\'m late.',
        jlptLevel: 'N5',
        tags: ['polite', 'apology'],
      },
      {
        id: 'n5-u10-v03',
        word: '失礼します',
        reading: 'しつれいします',
        meaning: 'excuse me (entering/leaving)',
        partOfSpeech: 'expression',
        exampleSentence: '失礼します。田中です。',
        exampleReading: 'しつれいします。たなかです。',
        exampleMeaning: 'Excuse me. I am Tanaka.',
        jlptLevel: 'N5',
        tags: ['polite', 'greeting'],
      },
      {
        id: 'n5-u10-v04',
        word: 'いただきます',
        reading: 'いただきます',
        meaning: 'expression before eating',
        partOfSpeech: 'expression',
        exampleSentence: 'いただきます！おいしそうですね。',
        exampleReading: 'いただきます！おいしそうですね。',
        exampleMeaning: 'Let\'s eat! It looks delicious.',
        jlptLevel: 'N5',
        tags: ['polite', 'food'],
      },
      {
        id: 'n5-u10-v05',
        word: 'ごちそうさま',
        reading: 'ごちそうさま',
        meaning: 'expression after eating',
        partOfSpeech: 'expression',
        exampleSentence: 'ごちそうさまでした。とてもおいしかったです。',
        exampleReading: 'ごちそうさまでした。とてもおいしかったです。',
        exampleMeaning: 'Thank you for the meal. It was very delicious.',
        jlptLevel: 'N5',
        tags: ['polite', 'food'],
      },
      // Question words
      {
        id: 'n5-u10-v06',
        word: 'どうして',
        reading: 'どうして',
        meaning: 'why',
        partOfSpeech: 'adverb',
        exampleSentence: 'どうして日本語を勉強していますか。',
        exampleReading: 'どうしてにほんごをべんきょうしていますか。',
        exampleMeaning: 'Why are you studying Japanese?',
        jlptLevel: 'N5',
        tags: ['question'],
      },
      {
        id: 'n5-u10-v07',
        word: 'いくら',
        reading: 'いくら',
        meaning: 'how much (price)',
        partOfSpeech: 'adverb',
        exampleSentence: 'このりんごはいくらですか。',
        exampleReading: 'このりんごはいくらですか。',
        exampleMeaning: 'How much is this apple?',
        jlptLevel: 'N5',
        tags: ['question', 'shopping'],
      },
      {
        id: 'n5-u10-v08',
        word: 'どのくらい',
        reading: 'どのくらい',
        meaning: 'how long; how much',
        partOfSpeech: 'adverb',
        exampleSentence: '駅までどのくらいですか。',
        exampleReading: 'えきまでどのくらいですか。',
        exampleMeaning: 'How long is it to the station?',
        jlptLevel: 'N5',
        tags: ['question', 'time'],
      },
      {
        id: 'n5-u10-v09',
        word: 'いつ',
        reading: 'いつ',
        meaning: 'when',
        partOfSpeech: 'adverb',
        exampleSentence: 'いつ日本に来ましたか。',
        exampleReading: 'いつにほんにきましたか。',
        exampleMeaning: 'When did you come to Japan?',
        jlptLevel: 'N5',
        tags: ['question', 'time'],
      },
      {
        id: 'n5-u10-v10',
        word: 'だれ',
        reading: 'だれ',
        meaning: 'who',
        partOfSpeech: 'noun',
        exampleSentence: 'あの人はだれですか。',
        exampleReading: 'あのひとはだれですか。',
        exampleMeaning: 'Who is that person?',
        jlptLevel: 'N5',
        tags: ['question'],
      },
      // Responses
      {
        id: 'n5-u10-v11',
        word: 'はい',
        reading: 'はい',
        meaning: 'yes',
        partOfSpeech: 'expression',
        exampleSentence: 'はい、そうです。',
        exampleReading: 'はい、そうです。',
        exampleMeaning: 'Yes, that\'s right.',
        jlptLevel: 'N5',
        tags: ['response'],
      },
      {
        id: 'n5-u10-v12',
        word: 'いいえ',
        reading: 'いいえ',
        meaning: 'no',
        partOfSpeech: 'expression',
        exampleSentence: 'いいえ、違います。',
        exampleReading: 'いいえ、ちがいます。',
        exampleMeaning: 'No, that\'s wrong.',
        jlptLevel: 'N5',
        tags: ['response'],
      },
      {
        id: 'n5-u10-v13',
        word: 'そうです',
        reading: 'そうです',
        meaning: 'that\'s right',
        partOfSpeech: 'expression',
        exampleSentence: 'そうです、私は学生です。',
        exampleReading: 'そうです、わたしはがくせいです。',
        exampleMeaning: 'That\'s right, I am a student.',
        jlptLevel: 'N5',
        tags: ['response'],
      },
      {
        id: 'n5-u10-v14',
        word: '違います',
        reading: 'ちがいます',
        meaning: 'that\'s wrong; it\'s different',
        partOfSpeech: 'verb',
        exampleSentence: 'それは違います。こちらです。',
        exampleReading: 'それはちがいます。こちらです。',
        exampleMeaning: 'That\'s wrong. It\'s this one.',
        jlptLevel: 'N5',
        tags: ['response'],
      },
      {
        id: 'n5-u10-v15',
        word: 'わかりました',
        reading: 'わかりました',
        meaning: 'I understand; understood',
        partOfSpeech: 'expression',
        exampleSentence: 'わかりました。ありがとうございます。',
        exampleReading: 'わかりました。ありがとうございます。',
        exampleMeaning: 'I understand. Thank you.',
        jlptLevel: 'N5',
        tags: ['response'],
      },
      {
        id: 'n5-u10-v16',
        word: 'わかりません',
        reading: 'わかりません',
        meaning: 'I don\'t understand',
        partOfSpeech: 'expression',
        exampleSentence: 'すみません、わかりません。',
        exampleReading: 'すみません、わかりません。',
        exampleMeaning: 'Sorry, I don\'t understand.',
        jlptLevel: 'N5',
        tags: ['response'],
      },
      // Situational words
      {
        id: 'n5-u10-v17',
        word: 'ちょっと',
        reading: 'ちょっと',
        meaning: 'a little; a moment',
        partOfSpeech: 'adverb',
        exampleSentence: 'ちょっと待ってください。',
        exampleReading: 'ちょっとまってください。',
        exampleMeaning: 'Please wait a moment.',
        jlptLevel: 'N5',
        tags: ['situational'],
      },
      {
        id: 'n5-u10-v18',
        word: 'たぶん',
        reading: 'たぶん',
        meaning: 'probably; maybe',
        partOfSpeech: 'adverb',
        exampleSentence: 'たぶん明日は雨です。',
        exampleReading: 'たぶんあしたはあめです。',
        exampleMeaning: 'It will probably rain tomorrow.',
        jlptLevel: 'N5',
        tags: ['situational'],
      },
      {
        id: 'n5-u10-v19',
        word: 'もう一度',
        reading: 'もういちど',
        meaning: 'one more time; again',
        partOfSpeech: 'expression',
        exampleSentence: 'もう一度言ってください。',
        exampleReading: 'もういちどいってください。',
        exampleMeaning: 'Please say it one more time.',
        jlptLevel: 'N5',
        tags: ['situational', 'request'],
      },
      {
        id: 'n5-u10-v20',
        word: 'ゆっくり',
        reading: 'ゆっくり',
        meaning: 'slowly',
        partOfSpeech: 'adverb',
        exampleSentence: 'ゆっくり話してください。',
        exampleReading: 'ゆっくりはなしてください。',
        exampleMeaning: 'Please speak slowly.',
        jlptLevel: 'N5',
        tags: ['situational', 'request'],
      },
      {
        id: 'n5-u10-v21',
        word: '大丈夫',
        reading: 'だいじょうぶ',
        meaning: 'okay; all right; fine',
        partOfSpeech: 'na-adjective',
        exampleSentence: '大丈夫ですか。',
        exampleReading: 'だいじょうぶですか。',
        exampleMeaning: 'Are you okay?',
        jlptLevel: 'N5',
        tags: ['situational'],
      },
      // Common phrases and verbs
      {
        id: 'n5-u10-v22',
        word: '話す',
        reading: 'はなす',
        meaning: 'to speak; to talk',
        partOfSpeech: 'verb',
        exampleSentence: '日本語を少し話せます。',
        exampleReading: 'にほんごをすこしはなせます。',
        exampleMeaning: 'I can speak a little Japanese.',
        jlptLevel: 'N5',
        tags: ['communication'],
      },
      {
        id: 'n5-u10-v23',
        word: '聞く',
        reading: 'きく',
        meaning: 'to ask; to listen',
        partOfSpeech: 'verb',
        exampleSentence: '先生に聞いてください。',
        exampleReading: 'せんせいにきいてください。',
        exampleMeaning: 'Please ask the teacher.',
        jlptLevel: 'N5',
        tags: ['communication'],
      },
      {
        id: 'n5-u10-v24',
        word: '言う',
        reading: 'いう',
        meaning: 'to say',
        partOfSpeech: 'verb',
        exampleSentence: 'これは日本語で何と言いますか。',
        exampleReading: 'これはにほんごでなんといいますか。',
        exampleMeaning: 'How do you say this in Japanese?',
        jlptLevel: 'N5',
        tags: ['communication'],
      },
      {
        id: 'n5-u10-v25',
        word: '待つ',
        reading: 'まつ',
        meaning: 'to wait',
        partOfSpeech: 'verb',
        exampleSentence: 'ここで待ってください。',
        exampleReading: 'ここでまってください。',
        exampleMeaning: 'Please wait here.',
        jlptLevel: 'N5',
        tags: ['action'],
      },
      {
        id: 'n5-u10-v26',
        word: '教える',
        reading: 'おしえる',
        meaning: 'to teach; to tell',
        partOfSpeech: 'verb',
        exampleSentence: '道を教えてください。',
        exampleReading: 'みちをおしえてください。',
        exampleMeaning: 'Please tell me the way.',
        jlptLevel: 'N5',
        tags: ['communication'],
      },
      {
        id: 'n5-u10-v27',
        word: '手伝う',
        reading: 'てつだう',
        meaning: 'to help',
        partOfSpeech: 'verb',
        exampleSentence: '手伝ってもいいですか。',
        exampleReading: 'てつだってもいいですか。',
        exampleMeaning: 'May I help you?',
        jlptLevel: 'N5',
        tags: ['action'],
      },
      {
        id: 'n5-u10-v28',
        word: '少し',
        reading: 'すこし',
        meaning: 'a little; a few',
        partOfSpeech: 'adverb',
        exampleSentence: '日本語が少しわかります。',
        exampleReading: 'にほんごがすこしわかります。',
        exampleMeaning: 'I understand a little Japanese.',
        jlptLevel: 'N5',
        tags: ['quantity'],
      },
      {
        id: 'n5-u10-v29',
        word: '全然',
        reading: 'ぜんぜん',
        meaning: 'not at all (with negative)',
        partOfSpeech: 'adverb',
        exampleSentence: '中国語は全然わかりません。',
        exampleReading: 'ちゅうごくごはぜんぜんわかりません。',
        exampleMeaning: 'I don\'t understand Chinese at all.',
        jlptLevel: 'N5',
        tags: ['quantity'],
      },
      {
        id: 'n5-u10-v30',
        word: 'すみません',
        reading: 'すみません',
        meaning: 'excuse me; sorry; thank you',
        partOfSpeech: 'expression',
        exampleSentence: 'すみません、トイレはどこですか。',
        exampleReading: 'すみません、といれはどこですか。',
        exampleMeaning: 'Excuse me, where is the restroom?',
        jlptLevel: 'N5',
        tags: ['polite', 'request'],
      },
    ],
    kanji: [
      {
        id: 'n5-u10-k01',
        character: '言',
        onYomi: ['ゲン', 'ゴン'],
        kunYomi: ['い.う', 'こと'],
        meaning: 'say; word',
        strokeCount: 7,
        jlptLevel: 'N5',
        commonWords: [
          { word: '言う', reading: 'いう', meaning: 'to say' },
          { word: '言葉', reading: 'ことば', meaning: 'word; language' },
        ],
        mnemonics: 'A mouth (口) with sound waves above it shows speaking.',
        chineseNote: 'Same as Chinese 言 (yan), meaning to speak or words.',
      },
      {
        id: 'n5-u10-k02',
        character: '分',
        onYomi: ['ブン', 'フン'],
        kunYomi: ['わ.かる', 'わ.ける'],
        meaning: 'minute; part; understand',
        strokeCount: 4,
        jlptLevel: 'N5',
        commonWords: [
          { word: '分かる', reading: 'わかる', meaning: 'to understand' },
          { word: '五分', reading: 'ごふん', meaning: 'five minutes' },
        ],
        mnemonics: 'A sword (刀) dividing something into parts.',
        chineseNote: 'Same as Chinese 分 (fen), meaning to divide or minute.',
      },
      {
        id: 'n5-u10-k03',
        character: '知',
        onYomi: ['チ'],
        kunYomi: ['し.る'],
        meaning: 'know',
        strokeCount: 8,
        jlptLevel: 'N5',
        commonWords: [
          { word: '知る', reading: 'しる', meaning: 'to know' },
          { word: '知らない', reading: 'しらない', meaning: 'don\'t know' },
        ],
        mnemonics: 'An arrow (矢) hitting the mouth (口) of knowledge.',
        chineseNote: 'Same as Chinese 知 (zhi), meaning to know.',
      },
      {
        id: 'n5-u10-k04',
        character: '思',
        onYomi: ['シ'],
        kunYomi: ['おも.う'],
        meaning: 'think',
        strokeCount: 9,
        jlptLevel: 'N5',
        commonWords: [
          { word: '思う', reading: 'おもう', meaning: 'to think' },
          { word: '思い出', reading: 'おもいで', meaning: 'memory' },
        ],
        mnemonics: 'A rice field (田) over the heart (心) shows thinking.',
        chineseNote: 'Same as Chinese 思 (si), meaning to think.',
      },
      {
        id: 'n5-u10-k05',
        character: '好',
        onYomi: ['コウ'],
        kunYomi: ['す.き', 'この.む'],
        meaning: 'like; fond of',
        strokeCount: 6,
        jlptLevel: 'N5',
        commonWords: [
          { word: '好き', reading: 'すき', meaning: 'like; fond of' },
          { word: '大好き', reading: 'だいすき', meaning: 'love; like very much' },
        ],
        mnemonics: 'A woman (女) holding a child (子) shows love.',
        chineseNote: 'Same as Chinese 好 (hao), meaning good or to like.',
      },
      {
        id: 'n5-u10-k06',
        character: '嫌',
        onYomi: ['ケン', 'ゲン'],
        kunYomi: ['きら.い', 'いや'],
        meaning: 'dislike; hate',
        strokeCount: 13,
        jlptLevel: 'N5',
        commonWords: [
          { word: '嫌い', reading: 'きらい', meaning: 'dislike' },
          { word: '嫌', reading: 'いや', meaning: 'unpleasant' },
        ],
        mnemonics: 'A woman (女) combined with two mouths shows displeasure.',
        chineseNote: 'Same as Chinese 嫌 (xian), meaning to dislike.',
      },
      {
        id: 'n5-u10-k07',
        character: '少',
        onYomi: ['ショウ'],
        kunYomi: ['すく.ない', 'すこ.し'],
        meaning: 'few; little',
        strokeCount: 4,
        jlptLevel: 'N5',
        commonWords: [
          { word: '少し', reading: 'すこし', meaning: 'a little' },
          { word: '少ない', reading: 'すくない', meaning: 'few' },
        ],
        mnemonics: 'Small (小) with one stroke removed means even less.',
        chineseNote: 'Same as Chinese 少 (shao), meaning few or little.',
      },
      {
        id: 'n5-u10-k08',
        character: '多',
        onYomi: ['タ'],
        kunYomi: ['おお.い'],
        meaning: 'many; much',
        strokeCount: 6,
        jlptLevel: 'N5',
        commonWords: [
          { word: '多い', reading: 'おおい', meaning: 'many; much' },
          { word: '多分', reading: 'たぶん', meaning: 'probably' },
        ],
        mnemonics: 'Two moons (夕夕) stacked means many nights, or many.',
        chineseNote: 'Same as Chinese 多 (duo), meaning many or much.',
      },
      {
        id: 'n5-u10-k09',
        character: '早',
        onYomi: ['ソウ', 'サッ'],
        kunYomi: ['はや.い'],
        meaning: 'early; fast',
        strokeCount: 6,
        jlptLevel: 'N5',
        commonWords: [
          { word: '早い', reading: 'はやい', meaning: 'early; fast' },
          { word: '早く', reading: 'はやく', meaning: 'quickly; early' },
        ],
        mnemonics: 'The sun (日) rising over a field means early morning.',
        chineseNote: 'Same as Chinese 早 (zao), meaning early.',
      },
      {
        id: 'n5-u10-k10',
        character: '遅',
        onYomi: ['チ'],
        kunYomi: ['おそ.い', 'おく.れる'],
        meaning: 'late; slow',
        strokeCount: 12,
        jlptLevel: 'N5',
        commonWords: [
          { word: '遅い', reading: 'おそい', meaning: 'late; slow' },
          { word: '遅れる', reading: 'おくれる', meaning: 'to be late' },
        ],
        mnemonics: 'Walking (辶) with a sheep (羊) and a tail shows slowness.',
        chineseNote: 'Same as Chinese 迟 (chi), meaning late or slow.',
      },
    ],
    grammar: [
      {
        id: 'n5-u10-g01',
        pattern: '〜てください',
        patternReading: '〜てください',
        meaning: 'please do ~',
        formation: 'Verb て-form + ください',
        explanation: 'This is the most common way to make polite requests in Japanese. It is used to ask someone to do something for you. The て-form of the verb is followed by ください.',
        examples: [
          {
            japanese: '窓を開けてください。',
            reading: 'まどをあけてください。',
            english: 'Please open the window.',
          },
          {
            japanese: '名前を書いてください。',
            reading: 'なまえをかいてください。',
            english: 'Please write your name.',
          },
          {
            japanese: 'もう一度言ってください。',
            reading: 'もういちどいってください。',
            english: 'Please say it one more time.',
          },
        ],
        notes: 'This is a standard polite request. For more casual speech, just use the て-form alone (e.g., 待って).',
        jlptLevel: 'N5',
      },
      {
        id: 'n5-u10-g02',
        pattern: '〜てもいいですか',
        patternReading: '〜てもいいですか',
        meaning: 'may I ~?; is it okay to ~?',
        formation: 'Verb て-form + もいいですか',
        explanation: 'This pattern is used to ask for permission to do something. It literally means "Is it okay even if I do ~?" The response can be はい、いいですよ (Yes, it\'s fine) or すみません、ちょっと... (Sorry, that\'s a bit...).',
        examples: [
          {
            japanese: '写真を撮ってもいいですか。',
            reading: 'しゃしんをとってもいいですか。',
            english: 'May I take a photo?',
          },
          {
            japanese: 'ここに座ってもいいですか。',
            reading: 'ここにすわってもいいですか。',
            english: 'May I sit here?',
          },
          {
            japanese: '質問してもいいですか。',
            reading: 'しつもんしてもいいですか。',
            english: 'May I ask a question?',
          },
        ],
        notes: 'To say "you may do ~", use 〜てもいいです (without か). For example: 食べてもいいですよ (You may eat).',
        jlptLevel: 'N5',
      },
      {
        id: 'n5-u10-g03',
        pattern: '〜はちょっと...',
        patternReading: '〜はちょっと...',
        meaning: '~ is a bit... (polite refusal)',
        formation: 'Noun/Verb + はちょっと...',
        explanation: 'This is a very common way to politely refuse or express hesitation in Japanese. By leaving the sentence incomplete with ちょっと (a little), you imply that something is difficult or problematic without directly saying no. This is considered more polite than a direct refusal.',
        examples: [
          {
            japanese: '明日はちょっと...',
            reading: 'あしたはちょっと...',
            english: 'Tomorrow is a bit... (I can\'t tomorrow)',
          },
          {
            japanese: 'お酒はちょっと...',
            reading: 'おさけはちょっと...',
            english: 'Alcohol is a bit... (I don\'t drink)',
          },
          {
            japanese: '肉はちょっと...',
            reading: 'にくはちょっと...',
            english: 'Meat is a bit... (I don\'t eat meat)',
          },
        ],
        notes: 'This indirect way of refusing is very Japanese. The listener understands you are declining without you having to say "no" directly.',
        jlptLevel: 'N5',
      },
      {
        id: 'n5-u10-g04',
        pattern: '〜と思います',
        patternReading: '〜とおもいます',
        meaning: 'I think ~',
        formation: 'Plain form + と思います',
        explanation: 'This pattern is used to express your opinion or what you think. The verb, adjective, or sentence before と思います should be in the plain form (dictionary form for present, た-form for past).',
        examples: [
          {
            japanese: '明日は雨だと思います。',
            reading: 'あしたはあめだとおもいます。',
            english: 'I think it will rain tomorrow.',
          },
          {
            japanese: 'この本はおもしろいと思います。',
            reading: 'このほんはおもしろいとおもいます。',
            english: 'I think this book is interesting.',
          },
          {
            japanese: '田中さんは来ないと思います。',
            reading: 'たなかさんはこないとおもいます。',
            english: 'I think Tanaka-san won\'t come.',
          },
        ],
        notes: 'For な-adjectives and nouns, add だ before と思います (e.g., きれいだと思います, 学生だと思います).',
        jlptLevel: 'N5',
      },
    ],
    reading: [
      {
        id: 'n5-u10-r01',
        title: 'Conversation at a Store',
        titleJapanese: 'お店での会話',
        passage: `私は昨日、デパートに行きました。かばんを買いたかったです。

店員さんが「いらっしゃいませ」と言いました。私は「すみません、かばんを見せてください」と言いました。

店員さんは赤いかばんを見せてくれました。「これはいかがですか」と聞きました。でも、私は「すみません、黒いかばんはありますか」と言いました。

店員さんは「はい、こちらです」と言って、黒いかばんを持ってきました。私は「いくらですか」と聞きました。店員さんは「三千円です」と言いました。

「これをお願いします」と私は言いました。店員さんは「ありがとうございます」と言いました。私は「ごちそうさまでした」...いいえ、違います。「ありがとうございました」と言いました。

買い物は楽しかったです。日本語で話せて、うれしかったです。`,
        passageWithFurigana: `私[わたし]は昨日[きのう]、デパートに行[い]きました。かばんを買[か]いたかったです。

店員[てんいん]さんが「いらっしゃいませ」と言[い]いました。私[わたし]は「すみません、かばんを見[み]せてください」と言[い]いました。

店員[てんいん]さんは赤[あか]いかばんを見[み]せてくれました。「これはいかがですか」と聞[き]きました。でも、私[わたし]は「すみません、黒[くろ]いかばんはありますか」と言[い]いました。

店員[てんいん]さんは「はい、こちらです」と言[い]って、黒[くろ]いかばんを持[も]ってきました。私[わたし]は「いくらですか」と聞[き]きました。店員[てんいん]さんは「三千円[さんぜんえん]です」と言[い]いました。

「これをお願[ねが]いします」と私[わたし]は言[い]いました。店員[てんいん]さんは「ありがとうございます」と言[い]いました。私[わたし]は「ごちそうさまでした」...いいえ、違[ちが]います。「ありがとうございました」と言[い]いました。

買[か]い物[もの]は楽[たの]しかったです。日本語[にほんご]で話[はな]せて、うれしかったです。`,
        wordCount: 180,
        difficulty: 'easy',
        questions: [
          {
            id: 'n5-u10-r01-q01',
            question: '何を買いたかったですか。',
            questionReading: 'なにをかいたかったですか。',
            type: 'multiple-choice',
            options: ['くつ', 'かばん', 'ぼうし', 'シャツ'],
            correctIndex: 1,
            explanation: '「かばんを買いたかったです」と書いてあります。',
          },
          {
            id: 'n5-u10-r01-q02',
            question: '何色のかばんを買いましたか。',
            questionReading: 'なにいろのかばんをかいましたか。',
            type: 'multiple-choice',
            options: ['赤', '青', '黒', '白'],
            correctIndex: 2,
            explanation: '「黒いかばんを持ってきました」「これをお願いします」と書いてあります。',
          },
          {
            id: 'n5-u10-r01-q03',
            question: 'かばんはいくらでしたか。',
            questionReading: 'かばんはいくらでしたか。',
            type: 'multiple-choice',
            options: ['千円', '二千円', '三千円', '五千円'],
            correctIndex: 2,
            explanation: '「三千円です」と店員さんが言いました。',
          },
        ],
      },
      {
        id: 'n5-u10-r02',
        title: 'Asking for Help in Japanese',
        titleJapanese: '日本語で助けを求める',
        passage: `私はアメリカから来た学生です。日本語を勉強しています。日本語は少しだけ話せます。

先週、道がわかりませんでした。駅に行きたかったです。私は近くにいた人に聞きました。

「すみません。駅はどこですか」と言いました。でも、その人は早く話しました。私はわかりませんでした。

「ごめんなさい、わかりません。もう一度お願いします。ゆっくり話してください」と言いました。

その人は「ああ、そうですか」と言って、ゆっくり話してくれました。「まっすぐ行ってください。右に曲がってください。五分ぐらいです」と言いました。

私は「わかりました。ありがとうございます」と言いました。その人は「いいえ、大丈夫ですよ」と言いました。

日本の人は親切だと思います。日本語がもっと上手になりたいです。`,
        passageWithFurigana: `私[わたし]はアメリカから来[き]た学生[がくせい]です。日本語[にほんご]を勉強[べんきょう]しています。日本語[にほんご]は少[すこ]しだけ話[はな]せます。

先週[せんしゅう]、道[みち]がわかりませんでした。駅[えき]に行[い]きたかったです。私[わたし]は近[ちか]くにいた人[ひと]に聞[き]きました。

「すみません。駅[えき]はどこですか」と言[い]いました。でも、その人[ひと]は早[はや]く話[はな]しました。私[わたし]はわかりませんでした。

「ごめんなさい、わかりません。もう一度[いちど]お願[ねが]いします。ゆっくり話[はな]してください」と言[い]いました。

その人[ひと]は「ああ、そうですか」と言[い]って、ゆっくり話[はな]してくれました。「まっすぐ行[い]ってください。右[みぎ]に曲[ま]がってください。五分[ごふん]ぐらいです」と言[い]いました。

私[わたし]は「わかりました。ありがとうございます」と言[い]いました。その人[ひと]は「いいえ、大丈夫[だいじょうぶ]ですよ」と言[い]いました。

日本[にほん]の人[ひと]は親切[しんせつ]だと思[おも]います。日本語[にほんご]がもっと上手[じょうず]になりたいです。`,
        wordCount: 200,
        difficulty: 'easy',
        questions: [
          {
            id: 'n5-u10-r02-q01',
            question: 'この人はどこに行きたかったですか。',
            questionReading: 'このひとはどこにいきたかったですか。',
            type: 'multiple-choice',
            options: ['学校', '駅', 'デパート', 'レストラン'],
            correctIndex: 1,
            explanation: '「駅に行きたかったです」と書いてあります。',
          },
          {
            id: 'n5-u10-r02-q02',
            question: 'どうして最初わかりませんでしたか。',
            questionReading: 'どうしてさいしょわかりませんでしたか。',
            type: 'multiple-choice',
            options: ['日本語がわからなかったから', 'その人が早く話したから', '道が遠かったから', '駅がなかったから'],
            correctIndex: 1,
            explanation: '「その人は早く話しました。私はわかりませんでした」と書いてあります。',
          },
          {
            id: 'n5-u10-r02-q03',
            question: '駅まで何分ぐらいですか。',
            questionReading: 'えきまでなんぷんぐらいですか。',
            type: 'multiple-choice',
            options: ['二分', '五分', '十分', '十五分'],
            correctIndex: 1,
            explanation: '「五分ぐらいです」と書いてあります。',
          },
        ],
      },
    ],
    listening: [
      {
        id: 'n5-u10-l01',
        title: 'Making Requests Politely',
        titleJapanese: 'ていねいにお願いする',
        transcript: `男：すみません。

女：はい、何ですか。

男：写真を撮ってもいいですか。

女：はい、いいですよ。どうぞ。

男：ありがとうございます。すみません、もう一つお願いがあります。

女：何ですか。

男：私の写真を撮ってください。

女：いいですよ。ここに立ってください。

男：はい。

女：はい、チーズ。撮りました。

男：ありがとうございます。とても助かりました。

女：いいえ、大丈夫ですよ。`,
        transcriptWithFurigana: `男[おとこ]：すみません。

女[おんな]：はい、何[なん]ですか。

男[おとこ]：写真[しゃしん]を撮[と]ってもいいですか。

女[おんな]：はい、いいですよ。どうぞ。

男[おとこ]：ありがとうございます。すみません、もう一[ひと]つお願[ねが]いがあります。

女[おんな]：何[なん]ですか。

男[おとこ]：私[わたし]の写真[しゃしん]を撮[と]ってください。

女[おんな]：いいですよ。ここに立[た]ってください。

男[おとこ]：はい。

女[おんな]：はい、チーズ。撮[と]りました。

男[おとこ]：ありがとうございます。とても助[たす]かりました。

女[おんな]：いいえ、大丈夫[だいじょうぶ]ですよ。`,
        duration: 40,
        difficulty: 'easy',
        speakers: ['男性', '女性'],
        questions: [
          {
            id: 'n5-u10-l01-q01',
            question: '男の人は最初に何を聞きましたか。',
            questionReading: 'おとこのひとはさいしょになにをききましたか。',
            type: 'multiple-choice',
            options: ['道を聞いた', '写真を撮ってもいいか聞いた', '名前を聞いた', '時間を聞いた'],
            correctIndex: 1,
            explanation: '「写真を撮ってもいいですか」と最初に聞きました。',
          },
          {
            id: 'n5-u10-l01-q02',
            question: '男の人は女の人に何をお願いしましたか。',
            questionReading: 'おとこのひとはおんなのひとになにをおねがいしましたか。',
            type: 'multiple-choice',
            options: ['道を教えてもらった', '写真を撮ってもらった', '名前を書いてもらった', '電話をしてもらった'],
            correctIndex: 1,
            explanation: '「私の写真を撮ってください」とお願いしました。',
          },
        ],
      },
      {
        id: 'n5-u10-l02',
        title: 'Basic Conversation at a Restaurant',
        titleJapanese: 'レストランでの会話',
        transcript: `店員：いらっしゃいませ。何名様ですか。

客：二人です。

店員：こちらへどうぞ。

客：ありがとうございます。

店員：メニューです。どうぞ。

客：すみません、これは何ですか。

店員：それはラーメンです。

客：辛いですか。

店員：いいえ、辛くないですよ。おいしいと思います。

客：じゃ、これをお願いします。

店員：はい、かしこまりました。お飲み物は？

客：水をお願いします。

店員：はい、少々お待ちください。

客：はい、ありがとうございます。`,
        transcriptWithFurigana: `店員[てんいん]：いらっしゃいませ。何名様[なんめいさま]ですか。

客[きゃく]：二人[ふたり]です。

店員[てんいん]：こちらへどうぞ。

客[きゃく]：ありがとうございます。

店員[てんいん]：メニューです。どうぞ。

客[きゃく]：すみません、これは何[なん]ですか。

店員[てんいん]：それはラーメンです。

客[きゃく]：辛[から]いですか。

店員[てんいん]：いいえ、辛[から]くないですよ。おいしいと思[おも]います。

客[きゃく]：じゃ、これをお願[ねが]いします。

店員[てんいん]：はい、かしこまりました。お飲[の]み物[もの]は？

客[きゃく]：水[みず]をお願[ねが]いします。

店員[てんいん]：はい、少々[しょうしょう]お待[ま]ちください。

客[きゃく]：はい、ありがとうございます。`,
        duration: 45,
        difficulty: 'easy',
        speakers: ['店員', '客'],
        questions: [
          {
            id: 'n5-u10-l02-q01',
            question: 'お客さんは何人ですか。',
            questionReading: 'おきゃくさんはなんにんですか。',
            type: 'multiple-choice',
            options: ['一人', '二人', '三人', '四人'],
            correctIndex: 1,
            explanation: '「二人です」と言っています。',
          },
          {
            id: 'n5-u10-l02-q02',
            question: 'お客さんは何を注文しましたか。',
            questionReading: 'おきゃくさんはなにをちゅうもんしましたか。',
            type: 'multiple-choice',
            options: ['すし', 'ラーメン', 'うどん', 'カレー'],
            correctIndex: 1,
            explanation: '店員が「それはラーメンです」と説明し、お客さんが「これをお願いします」と注文しました。',
          },
          {
            id: 'n5-u10-l02-q03',
            question: 'お客さんは何を飲みますか。',
            questionReading: 'おきゃくさんはなにをのみますか。',
            type: 'multiple-choice',
            options: ['お茶', '水', 'コーヒー', 'ジュース'],
            correctIndex: 1,
            explanation: '「水をお願いします」と言っています。',
          },
        ],
      },
    ],
  },
};
