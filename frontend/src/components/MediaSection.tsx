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
        <div className="container-main bg-gray-100 flex flex-col p-6 rounded-sm mb-8">
            <div className="flex justify-start items-center space-x-6 mb-4">
                <span className="text-[#00217B] text-[20px] font-extrabold tracking-tight uppercase pl-3 border-l-[5px] border-[#cc0000] leading-none hover:text-red-700 transition-colors cursor-pointer">
                    MEDIA
                </span>
                <ul className="flex justify-start gap-5 items-center text-[#cc0000] font-bold text-[13px] uppercase">
                    {MEDIA_CATEGORIES.map((cat) => (
                        <li key={cat} className="cursor-pointer">
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>

            <MediaCarousel articles={articles} />
        </div>
    );
};
