interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className = "" }: SkeletonProps) => (
    <div className={`bg-gray-200 animate-pulse ${className}`} />
);

interface ArticleCardSkeletonProps {
    count?: number;
    imageWidth?: string;
    imageHeight?: string;
    className?: string;
}

export const ArticleCardSkeleton = ({
    count = 3,
    imageWidth = "120px",
    imageHeight = "70px",
    className = "",
}: ArticleCardSkeletonProps) => (
    <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
                <div
                    className="bg-gray-200 shrink-0"
                    style={{ width: imageWidth, height: imageHeight }}
                />
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
            </div>
        ))}
    </div>
);

export const MainArticleSkeleton = () => (
    <div className="bg-white animate-pulse">
        <div className="flex flex-col">
            <div className="w-full h-[300px] bg-gray-200" />
            <div className="p-4 space-y-3">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
        </div>
    </div>
);

interface HotNewsSkeletonProps {
    count?: number;
}

export const HotNewsSkeleton = ({ count = 4 }: HotNewsSkeletonProps) => (
    <div className="space-y-4 animate-pulse">
        <div className="bg-gray-200 h-8 w-24 mb-4" />
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex gap-4">
                <div className="w-[180px] h-[110px] bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 w-1/4" />
                    <div className="h-6 bg-gray-200 w-full" />
                    <div className="h-6 bg-gray-200 w-2/3" />
                </div>
            </div>
        ))}
    </div>
);

interface CategoryBlockSkeletonProps {
    count?: number;
}

export const CategoryBlockSkeleton = ({ count = 3 }: CategoryBlockSkeletonProps) => (
    <div className="animate-pulse space-y-8">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded" />
        ))}
    </div>
);

interface CarouselCardSkeletonProps {
    count?: number;
    cardWidth?: string;
}

export const CarouselCardSkeleton = ({
    count = 4,
    cardWidth = "280px",
}: CarouselCardSkeletonProps) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="shrink-0 animate-pulse" style={{ width: cardWidth }}>
                <div className="aspect-video bg-gray-100 rounded-sm mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
        ))}
    </>
);

export const CategorySectionSkeleton = () => (
    <div className="bg-white mb-4 animate-pulse">
        <div className="section-header">
            <div className="h-5 bg-gray-200 rounded w-24" />
        </div>
        <div className="flex gap-4 p-4">
            <div className="w-[300px] h-[180px] bg-gray-200 rounded shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
        </div>
    </div>
);
