interface ArticleBreadcrumbProps {
    category: string;
}

export const ArticleBreadcrumb = ({ category }: ArticleBreadcrumbProps) => (
    <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 uppercase tracking-wider font-semibold">
        <span className="text-red-600 font-bold">{category}</span>
        <span className="text-gray-300">/</span>
        <span className="truncate whitespace-nowrap overflow-hidden">Chi tiết bài viết</span>
    </nav>
);
