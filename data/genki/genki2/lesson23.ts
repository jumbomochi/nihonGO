import { GenkiLesson } from '@/types/genki';
import { generateLessonAudioTracks } from '../audio/audioManifest';

export const lesson23: GenkiLesson = {
  id: 'genki2-lesson23',
  book: 'genki2',
  lessonNumber: 23,
  title: 'Farewell',
  titleJapanese: 'さようなら',
  description:
    'The final lesson covers expressing wishes with ～といい, concession with ～のに, and preparing to say goodbye.',
  objectives: [
    'Express wishes and hopes with ～といい',
    'Use ～のに to express disappointment or contrast',
    'Review and consolidate conditional forms',
    'Express gratitude and farewells appropriately',
    'Apply advanced grammar in farewell contexts',
  ],
  estimatedMinutes: 90,
  sections: [
    {
      id: 'l23-dialogue',
      type: 'dialogue',
      title: 'Dialogue',
      titleJapanese: 'かいわ',
      content: {
        dialogue: {
          id: 'l23-d01',
          title: 'Saying Goodbye',
          titleJapanese: 'そつぎょう',
          context: 'Mary is preparing to return to America after studying in Japan. She talks with her friends.',
          characters: ['Friend', 'Mary'],
          lines: [
            {
              speaker: 'Friend',
              japanese: 'メアリー、もうすぐアメリカに帰るんだね。さびしくなるよ。',
              reading: 'めありー、もうすぐあめりかにかえるんだね。さびしくなるよ。',
              english: "Mary, you're going back to America soon. I'll miss you.",
            },
            {
              speaker: 'Mary',
              japanese: 'うん、私もさびしいよ。もっとながくいられたらいいのに。',
              reading: 'うん、わたしもさびしいよ。もっとながくいられたらいいのに。',
              english: "Yeah, I'm sad too. I wish I could stay longer.",
            },
            {
              speaker: 'Friend',
              japanese: '日本でべんきょうできてよかったね。',
              reading: 'にほんでべんきょうできてよかったね。',
              english: "It's good that you could study in Japan.",
            },
            {
              speaker: 'Mary',
              japanese: 'ほんとうに。みんなにあえてよかった。',
              reading: 'ほんとうに。みんなにあえてよかった。',
              english: "Really. I'm glad I could meet everyone.",
            },
            {
              speaker: 'Friend',
              japanese: 'ビデオ通話で話せばいいよ。それに、日本の会社で働けるといいね。',
              reading: 'びでおつうわではなせばいいよ。それに、にほんのかいしゃではたらけるといいね。',
              english: 'We can talk on video calls. And I hope you can work at a Japanese company.',
            },
            {
              speaker: 'Mary',
              japanese: 'そうだね。いつかもどってきたいな。',
              reading: 'そうだね。いつかもどってきたいな。',
              english: 'Yeah. I want to come back someday.',
            },
            {
              speaker: 'Friend',
              japanese: 'ぜったいもどってきてね。お元気で。',
              reading: 'ぜったいもどってきてね。おげんきで。',
              english: 'Definitely come back. Take care.',
            },
          ],
        },
      },
    },
    {
      id: 'l23-vocab',
      type: 'vocabulary',
      title: 'Vocabulary',
      titleJapanese: 'たんご',
      content: {
        vocabulary: [
          { id: 'l23-v01', japanese: '別れ', reading: 'わかれ', romaji: 'wakare', english: 'parting; farewell', partOfSpeech: 'noun' },
          { id: 'l23-v02', japanese: '送別会', reading: 'そうべつかい', romaji: 'soubetsukai', english: 'farewell party', partOfSpeech: 'noun' },
          { id: 'l23-v03', japanese: '思い出', reading: 'おもいで', romaji: 'omoide', english: 'memory; memento', partOfSpeech: 'noun' },
          { id: 'l23-v04', japanese: '約束', reading: 'やくそく', romaji: 'yakusoku', english: 'promise; appointment', partOfSpeech: 'noun' },
          { id: 'l23-v05', japanese: '連絡', reading: 'れんらく', romaji: 'renraku', english: 'contact; communication', partOfSpeech: 'noun' },
          { id: 'l23-v06', japanese: '機会', reading: 'きかい', romaji: 'kikai', english: 'opportunity; chance', partOfSpeech: 'noun' },
          { id: 'l23-v07', japanese: '将来', reading: 'しょうらい', romaji: 'shourai', english: 'future', partOfSpeech: 'noun' },
          { id: 'l23-v08', japanese: '夢', reading: 'ゆめ', romaji: 'yume', english: 'dream', partOfSpeech: 'noun' },
          { id: 'l23-v09', japanese: 'さびしい', reading: 'さびしい', romaji: 'sabishii', english: 'lonely; sad', partOfSpeech: 'i-adjective' },
          { id: 'l23-v10', japanese: 'なつかしい', reading: 'なつかしい', romaji: 'natsukashii', english: 'nostalgic; dear', partOfSpeech: 'i-adjective' },
          { id: 'l23-v11', japanese: 'うれしい', reading: 'うれしい', romaji: 'ureshii', english: 'happy; glad', partOfSpeech: 'i-adjective' },
          { id: 'l23-v12', japanese: 'ざんねん', reading: 'ざんねん', romaji: 'zannen', english: 'regrettable; disappointing', partOfSpeech: 'na-adjective' },
          { id: 'l23-v13', japanese: '戻る', reading: 'もどる', romaji: 'modoru', english: 'to return; to go back', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l23-v14', japanese: '見送る', reading: 'みおくる', romaji: 'miokuru', english: 'to see off', partOfSpeech: 'verb', category: 'Verbs (う-verbs)' },
          { id: 'l23-v15', japanese: '別れる', reading: 'わかれる', romaji: 'wakareru', english: 'to part; to separate', partOfSpeech: 'verb', category: 'Verbs (る-verbs)' },
          { id: 'l23-v16', japanese: 'おかげで', reading: 'おかげで', romaji: 'okage de', english: 'thanks to', partOfSpeech: 'expression' },
          { id: 'l23-v17', japanese: 'いつか', reading: 'いつか', romaji: 'itsuka', english: 'someday', partOfSpeech: 'adverb' },
          { id: 'l23-v18', japanese: 'きっと', reading: 'きっと', romaji: 'kitto', english: 'surely; certainly', partOfSpeech: 'adverb' },
          { id: 'l23-v19', japanese: 'お元気で', reading: 'おげんきで', romaji: 'ogenki de', english: 'take care (farewell)', partOfSpeech: 'expression' },
          { id: 'l23-v20', japanese: '気をつけて', reading: 'きをつけて', romaji: 'ki wo tsukete', english: 'be careful; take care', partOfSpeech: 'expression' },
        ],
      },
    },
    {
      id: 'l23-grammar',
      type: 'grammar',
      title: 'Grammar',
      titleJapanese: 'ぶんぽう',
      content: {
        grammar: [
          {
            id: 'l23-g01',
            title: '〜といい',
            pattern: 'Plain form (non-past) + といい',
            explanation:
              '～といい expresses a wish or hope. ～といいですね is for others\' situations. ～といいな is more personal and casual.',
            culturalNote:
              'This pattern is very common in farewell situations and when expressing good wishes.',
            examples: [
              {
                japanese: 'あした晴れるといいですね。',
                reading: 'あしたはれるといいですね。',
                english: "I hope it's sunny tomorrow.",
              },
              {
                japanese: 'また会えるといいですね。',
                reading: 'またあえるといいですね。',
                english: 'I hope we can meet again.',
              },
            ],
          },
          {
            id: 'l23-g02',
            title: '〜のに',
            pattern: 'Plain form + のに',
            explanation:
              '～のに expresses contrast with a sense of disappointment, frustration, or regret. It\'s stronger than ～けど.',
            culturalNote:
              'Often used when things don\'t go as expected.',
            examples: [
              {
                japanese: '勉強したのに、テストに落ちた。',
                reading: 'べんきょうしたのに、てすとにおちた。',
                english: 'Even though I studied, I failed the test.',
              },
              {
                japanese: 'やくそくしたのに、来なかった。',
                reading: 'やくそくしたのに、こなかった。',
                english: "Even though they promised, they didn't come.",
              },
            ],
          },
          {
            id: 'l23-g03',
            title: '〜たらいいのに / 〜ばいいのに',
            pattern: 'たら/ば form + いいのに',
            explanation:
              '～たらいいのに / ～ばいいのに expresses an unfulfilled wish, something contrary to current reality.',
            culturalNote:
              'Adding な or なあ at the end makes it sound more wistful.',
            examples: [
              {
                japanese: 'もっとお金があったらいいのに。',
                reading: 'もっとおかねがあったらいいのに。',
                english: 'I wish I had more money.',
              },
              {
                japanese: '日本にすめればいいのに。',
                reading: 'にほんにすめればいいのに。',
                english: 'I wish I could live in Japan.',
              },
            ],
          },
          {
            id: 'l23-g04',
            title: '〜てよかった',
            pattern: 'て-form + よかった',
            explanation:
              '～てよかった expresses relief or satisfaction about something that happened.',
            culturalNote:
              'Heartfelt expression commonly used in farewell situations.',
            examples: [
              {
                japanese: '日本に来てよかった。',
                reading: 'にほんにきてよかった。',
                english: "I'm glad I came to Japan.",
              },
              {
                japanese: 'あなたに会えてよかった。',
                reading: 'あなたにあえてよかった。',
                english: "I'm glad I could meet you.",
              },
            ],
          },
          {
            id: 'l23-g05',
            title: '〜おかげで',
            pattern: 'Plain form (past) + おかげで; Noun + のおかげで',
            explanation:
              '～おかげで expresses gratitude for positive outcomes. For negative outcomes caused by someone, ～せいで is used.',
            culturalNote:
              'Expressing gratitude using おかげで is considered polite in formal farewells.',
            examples: [
              {
                japanese: 'みなさんのおかげで、たのしい1年でした。',
                reading: 'みなさんのおかげで、たのしいいちねんでした。',
                english: 'Thanks to everyone, it was an enjoyable year.',
              },
              {
                japanese: '先生のおかげで、日本語が上手になりました。',
                reading: 'せんせいのおかげで、にほんごがじょうずになりました。',
                english: 'Thanks to my teacher, my Japanese improved.',
              },
            ],
          },
          {
            id: 'l23-g06',
            title: 'Conditional Summary',
            pattern: 'と, ば, たら, なら comparison',
            explanation:
              'と is for natural/habitual results. ば is for hypothetical conditions. たら is most versatile for one-time events. なら responds to stated topics.',
            culturalNote:
              'Mastering conditionals is essential for nuanced Japanese.',
            examples: [
              {
                japanese: '春になると、さくらが咲きます。(と)',
                reading: 'はるになると、さくらがさきます。',
                english: 'When spring comes, cherry blossoms bloom.',
              },
              {
                japanese: '日本に行くなら、京都に行ってください。(なら)',
                reading: 'にほんにいくなら、きょうとにいってください。',
                english: 'If you\'re going to Japan, please go to Kyoto.',
              },
            ],
          },
        ],
      },
    },
    {
      id: 'l23-culture',
      type: 'culture',
      title: 'Culture Note',
      titleJapanese: 'ぶんかノート',
      content: {
        culturalNote: {
          id: 'l23-c01',
          title: 'Japanese Farewell Culture',
          content:
            'Farewells in Japan are emotional occasions marked by gift-giving, farewell parties (送別会), and heartfelt expressions of hope to meet again. The phrase "さようなら" is actually quite formal and final—Japanese people prefer "またね" (see you again) or "じゃあね" for casual goodbyes. The concept of "縁" (en, mysterious bonds between people) provides comfort during partings—the belief that meaningful connections will bring people together again.',
          relatedLesson: 'genki2-lesson23',
        },
      },
    },
  ],
  audioTracks: generateLessonAudioTracks('genki2', 23, 18),
};
