import { MediaCarousel } from "./MediaCarousel";
import type { Article } from "../types/article.type";

const MEDIA_CATEGORIES = [
    "TIN TỨC TV",
    "VIDEO",
    "ẢNH",
    "INFOGRAPHIC",
    "MEGASTORY",
    "ẢNH 360",
    "TALK SHOW",
    "PODCAST",
];

interface MediaSectionProps {
    articles: Article[];
}

export const MediaSection = ({ articles }: MediaSectionProps) => {
    return (
        <div className="container-main bg-gray-100 dark:bg-gray-800 flex flex-col p-6 rounded-sm mb-8">
            <div className="flex justify-start items-center space-x-6 mb-4">
                <span className="text-[#00217B] dark:text-orange-300 text-[20px] font-extrabold tracking-tight uppercase pl-3 border-l-[5px] border-[#cc0000] dark:border-orange-300 leading-none hover:text-red-700 dark:hover:text-orange-200 transition-colors cursor-pointer">
                    MEDIA
                </span>
                <ul className="flex justify-start gap-5 items-center text-[#cc0000] dark:text-orange-300 font-bold text-[13px] uppercase">
                    {MEDIA_CATEGORIES.map((cat) => (
                        <li key={cat} className="cursor-pointer hover:text-orange-200 dark:hover:text-orange-400 transition-colors">
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>

            <MediaCarousel articles={articles} />
        </div>
    );
};
