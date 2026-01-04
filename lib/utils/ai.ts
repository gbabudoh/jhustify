import Groq from 'groq-sdk';

const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

/**
 * Analyzes the sentiment of a business review comment.
 * Returns a concise summary of the sentiment.
 */
export async function analyzeSentiment(comment: string): Promise<string> {
  if (!comment || comment.trim().length < 5) {
    return "";
  }

  if (!groq) {
    console.warn('GROQ_API_KEY not found. Using fallback sentiment analysis.');
    return mockSentimentAnalysis(comment);
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an AI that analyzes business reviews. Provide a very concise sentiment summary (max 10 words) like "Highly positive about service speed" or "Mixed views on pricing". Focus on actionable feedback.',
        },
        {
          role: 'user',
          content: `Analyze this review: "${comment}"`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 50,
    });

    return chatCompletion.choices[0]?.message?.content?.trim() || "Neutral sentiment";
  } catch (error) {
    console.error('Error analyzing sentiment with Groq:', error);
    return mockSentimentAnalysis(comment);
  }
}

function mockSentimentAnalysis(comment: string): string {
  const lowercase = comment.toLowerCase();
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'best', 'fast', 'reliable', 'trust', 'honest'];
  const negativeWords = ['bad', 'poor', 'slow', 'scam', 'fake', 'rude', 'expensive', 'late'];

  let posCount = 0;
  let negCount = 0;

  positiveWords.forEach(word => { if (lowercase.includes(word)) posCount++; });
  negativeWords.forEach(word => { if (lowercase.includes(word)) negCount++; });

  if (posCount > negCount) return "Generally positive review";
  if (negCount > posCount) return "Generally negative review";
  return "Neutral or mixed review";
}
