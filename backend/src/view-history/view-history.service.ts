import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface ViewHistoryRecord {
    id: number;
    userId: number;
    articleSlug: string;
    viewedAt: string;
}

interface Article {
    slug: string;
    title: string;
    category: string;
    thumbnail?: string;
    image?: string;
}

@Injectable()
export class ViewHistoryService {
    private readonly dataPath = path.join(process.cwd(), 'data', 'view-history.json');
    private readonly dataDir = path.join(process.cwd(), 'data');

    private readData(): ViewHistoryRecord[] {
        try {
            if (!fs.existsSync(this.dataPath)) {
                fs.writeFileSync(this.dataPath, '[]');
                return [];
            }
            const data = fs.readFileSync(this.dataPath, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    private writeData(data: ViewHistoryRecord[]): void {
        fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
    }

    private readAllArticles(): Article[] {
        try {
            const allArticles: Article[] = [];
            const files = fs.readdirSync(this.dataDir);

            // Category files to read
            const categoryFiles = files.filter(f =>
                f.endsWith('.json') &&
                !['users.json', 'categories.json', 'comments.json', 'notifications.json',
                    'bookmarks.json', 'view-history.json', 'comment_reactions.json'].includes(f)
            );

            for (const file of categoryFiles) {
                try {
                    const filePath = path.join(this.dataDir, file);
                    const data = fs.readFileSync(filePath, 'utf-8');
                    const parsed = JSON.parse(data);

                    // Handle both array format and object with articles property
                    const articles = Array.isArray(parsed) ? parsed : (parsed.articles || []);
                    allArticles.push(...articles);
                } catch {
                    // Skip files that can't be parsed
                }
            }

            return allArticles;
        } catch {
            return [];
        }
    }

    private getNextId(data: ViewHistoryRecord[]): number {
        if (data.length === 0) return 1;
        return Math.max(...data.map(r => r.id)) + 1;
    }

    addView(userId: number, articleSlug: string): { success: boolean; message: string } {
        const data = this.readData();

        // Check if already viewed
        const existingIndex = data.findIndex(
            r => r.userId === userId && r.articleSlug === articleSlug
        );

        if (existingIndex !== -1) {
            // Update viewedAt time
            data[existingIndex].viewedAt = new Date().toISOString();
            // Move to end (most recent)
            const [item] = data.splice(existingIndex, 1);
            data.push(item);
        } else {
            // Add new record
            const newRecord: ViewHistoryRecord = {
                id: this.getNextId(data),
                userId,
                articleSlug,
                viewedAt: new Date().toISOString(),
            };
            data.push(newRecord);
        }

        this.writeData(data);
        return { success: true, message: 'View recorded' };
    }

    getHistory(userId: number, limit: number = 20) {
        const data = this.readData();
        const articles = this.readAllArticles();

        const userHistory = data
            .filter(r => r.userId === userId)
            .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
            .slice(0, limit);

        return userHistory.map(record => {
            const article = articles.find(a => a.slug === record.articleSlug);
            return {
                id: record.id,
                articleSlug: record.articleSlug,
                viewedAt: record.viewedAt,
                article: article ? {
                    title: article.title,
                    category: article.category,
                    thumbnail: article.thumbnail || article.image,
                } : null,
            };
        });
    }

    clearHistory(userId: number): { success: boolean; message: string } {
        const data = this.readData();
        const filtered = data.filter(r => r.userId !== userId);
        this.writeData(filtered);
        return { success: true, message: 'History cleared' };
    }

    removeView(userId: number, articleSlug: string): { success: boolean; message: string } {
        const data = this.readData();
        const filtered = data.filter(
            r => !(r.userId === userId && r.articleSlug === articleSlug)
        );
        this.writeData(filtered);
        return { success: true, message: 'View removed' };
    }
}
