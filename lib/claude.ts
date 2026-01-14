import { LearningStyle, ProficiencyLevel } from '@/stores/userStore';
import {
  AuthError,
  RateLimitError,
  NetworkError,
  ApiError,
  ValidationError,
} from './errors';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

interface UserContext {
  nativeLanguage: string;
  priorLanguages: string[];
  knowsChinese: boolean;
  proficiencyLevel: ProficiencyLevel;
  learningGoals: string[];
  learningStyle: LearningStyle;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function buildSystemPrompt(userContext: UserContext): string {
  const styleInstructions = userContext.learningStyle === 'detailed'
    ? `Provide detailed explanations with cultural context. Explain WHY natives choose specific expressions, not just grammar rules. Give multiple examples across different scenarios.`
    : `Keep explanations concise and practical. Focus on immediate application through conversation. Less theory, more active practice.`;

  const chineseContext = userContext.knowsChinese
    ? `The learner understands Chinese characters. When introducing kanji, you can reference Chinese origins and explain reading variations contextually.`
    : `The learner does not know Chinese. Introduce kanji gradually with mnemonics and clear explanations of readings.`;

  return `You are nihonGO, a friendly Japanese language tutor for beginners. Your approach is personalized and interactive, focusing on practical Japanese acquisition.

## Learner Profile
- Native language: ${userContext.nativeLanguage || 'English'}
- Prior language experience: ${userContext.priorLanguages.length > 0 ? userContext.priorLanguages.join(', ') : 'None'}
- Current level: ${userContext.proficiencyLevel.replace('_', ' ')}
- Learning goals: ${userContext.learningGoals.length > 0 ? userContext.learningGoals.join(', ') : 'General Japanese proficiency'}

## Teaching Style
${styleInstructions}

## Special Considerations
${chineseContext}

## Core Principles
1. **Cultural Context First**: Always explain why natives choose specific expressions
2. **Practical Examples**: Use real-world scenarios, not abstract textbook situations
3. **Comparative Learning**: When teaching similar grammar points, compare them with native usage patterns
4. **Encouragement**: Be supportive while maintaining accuracy

## Formatting
- Use Japanese text followed by romaji in parentheses for beginners
- Include English translations
- Break down complex concepts into digestible parts
- Use bullet points for clarity when appropriate`;
}

export async function sendMessage(
  messages: Message[],
  userContext: UserContext,
  apiKey: string
): Promise<string> {
  // Validate inputs
  if (!apiKey || apiKey.trim().length === 0) {
    throw new ValidationError('API key is required', 'Please enter your API key in Settings.');
  }

  if (messages.length === 0) {
    throw new ValidationError('At least one message is required');
  }

  let response: Response;

  try {
    response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: buildSystemPrompt(userContext),
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });
  } catch (error) {
    // Network errors (no internet, DNS failure, etc.)
    if (error instanceof TypeError) {
      throw new NetworkError('Failed to connect to API');
    }
    throw error;
  }

  // Handle HTTP error responses
  if (!response.ok) {
    let errorDetails = '';

    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorJson = await response.json();
        errorDetails = errorJson.error?.message || errorJson.message || '';
      } else {
        errorDetails = await response.text();
      }
    } catch {
      errorDetails = 'Unknown error';
    }

    // Handle specific error codes
    switch (response.status) {
      case 401:
        throw new AuthError('Invalid API key');
      case 429:
        throw new RateLimitError('Too many requests');
      case 400:
        throw new ApiError(`Bad request: ${errorDetails}`, 400);
      case 500:
      case 502:
      case 503:
        throw new ApiError('Claude API is temporarily unavailable', response.status);
      default:
        throw new ApiError(`API error: ${errorDetails}`, response.status);
    }
  }

  // Parse and validate response
  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Invalid response from API', 500);
  }

  // Validate response structure
  if (!data.content?.[0]?.text) {
    throw new ApiError('Unexpected response format from API', 500);
  }

  return data.content[0].text;
}

export function createLessonPrompt(topic: string, userContext: UserContext): string {
  const levelContext = {
    complete_beginner: 'This is their very first exposure to Japanese.',
    beginner: 'They know hiragana/katakana and basic greetings.',
    elementary: 'They can form simple sentences and know common vocabulary.',
    intermediate: 'They can hold basic conversations and read simple texts.',
  };

  return `Please teach me about: ${topic}

Context: ${levelContext[userContext.proficiencyLevel]}

Provide a structured mini-lesson that includes:
1. Introduction to the concept
2. Key vocabulary or grammar points
3. Practical examples with cultural context
4. A simple practice exercise`;
}
