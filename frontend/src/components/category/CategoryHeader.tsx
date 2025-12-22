import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryHeaderProps {
    category: string;
    subCategories?: string[];
}

export const CategoryHeader = ({ category, subCategories }: CategoryHeaderProps) => {
    const formattedCategory = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="mb-8 border-b-2 border-primary pb-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <h1 className="bg-primary text-white px-4 py-1.5 text-xl font-bold uppercase tracking-wide">
                    {formattedCategory}
                </h1>

                {subCategories && subCategories.length > 0 && (
                    <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
                        {subCategories.map((sub, index) => (
                            <Link
                                key={index}
                                to={`/${category}/${sub.toLowerCase().replace(/ /g, '-')}`}
                                className="text-primary transition-colors flex items-center gap-1"
                            >
                                {sub}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-tighter">
                <Link to="/" className="text-primary transition-colors">Trang chủ</Link>
                <ChevronRight size={12} />
                <span className="font-bold text-gray-800">{formattedCategory}</span>
            </div>
        </div>
    );
};
