import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenAI;
  private isConfigured = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        this.genAI = new GoogleGenAI({ apiKey });
        this.isConfigured = true;
        this.logger.log('Google Generative AI configured.');
      } catch (error) {
        this.logger.error(
          'Failed to initialize Google Generative AI client',
          error,
        );
      }
    } else {
      this.logger.warn(
        'GOOGLE_API_KEY not set. AI Summarization will fall back to mock response.',
      );
    }
  }

  async summarize(text: string): Promise<string | undefined> {
    if (!this.isConfigured) {
      this.logger.warn(
        'Google Generative AI not configured. Returning mock summary.',
      );
      return `[MOCK SUMMARY] This is a simulated summary because Google GenAI is not configured. 
      Original text length: ${text.length} characters. 
      Please set GOOGLE_API_KEY to use real AI.`;
    }

    try {
      const prompt = `Summarize the following article in a concise and engaging way, don't use icon, suitable for a comment section:\n\n${text}`;

      const result = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      const summary = result.text;

      return summary;
    } catch (error) {
      this.logger.error('Error generating summary with Google GenAI', error);
      return 'Sorry, I encountered an error while trying to summarize this article. Please try again later.';
    }
  }
}
