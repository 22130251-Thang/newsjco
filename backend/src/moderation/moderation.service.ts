import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ModerationResult {
    flagged: boolean;
    reason?: string;
}

@Injectable()
export class ModerationService {
    private readonly logger = new Logger(ModerationService.name);
    private readonly apiKey: string;
    private readonly apiUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
        this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${this.apiKey}`;

        if (!this.apiKey) {
            this.logger.warn('GEMINI_API_KEY not found in environment');
        }
    }

    async checkContent(text: string): Promise<ModerationResult> {
        if (!this.apiKey) {
            this.logger.warn('Moderation skipped: No API key configured');
            return { flagged: false };
        }

        if (!text || text.trim().length === 0) {
            return { flagged: false };
        }

        try {
            const prompt = `Kiem tra binh luan: '${text}'. Neu tho tuc, xuc pham, spam hoac khong phu hop tra ve TRUE. Neu an toan tra ve FALSE. Chi tra ve TRUE hoac FALSE.`;

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                }),
            });

            if (!response.ok) {
                this.logger.error(`Gemini API error: ${response.status} ${response.statusText}`);
                return { flagged: false };
            }

            const data = await response.json();
            const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase();

            if (result === 'TRUE') {
                this.logger.log(`Content flagged by Gemini AI`);
                return {
                    flagged: true,
                    reason: 'nội dung không phù hợp',
                };
            }

            return { flagged: false };
        } catch (error) {
            this.logger.error('Moderation check failed:', error);
            return { flagged: false };
        }
    }
}
