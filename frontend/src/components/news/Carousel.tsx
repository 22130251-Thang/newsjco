import { useRef, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
    children: ReactNode;
    gap?: number;
    buttonOffset?: string;
    buttonTop?: string;
    className?: string;
}

export const Carousel = ({
    children,
    gap = 5,
    buttonOffset = "-12px",
    buttonTop = "40%",
    className = ""
}: CarouselProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className={`relative group/carousel ${className}`}>
            <button
                onClick={() => scroll('left')}
                style={{ left: buttonOffset, top: buttonTop }}
                className="absolute -translate-y-1/2 z-20 bg-white p-2 text-gray-400 disabled:opacity-0 transition-colors border border-gray-100 shadow-sm"
                aria-label="Previous"
            >
                <ChevronLeft size={20} />
            </button>

            <div
                ref={scrollRef}
                style={{ gap: `${gap * 4}px` }}
                className="flex overflow-x-auto no-scrollbar scroll-smooth pb-2 snap-x"
            >
                {children}
            </div>

            <button
                onClick={() => scroll('right')}
                style={{ right: buttonOffset, top: buttonTop }}
                className="absolute -translate-y-1/2 z-20 bg-white p-2 text-gray-400 transition-colors border border-gray-100 shadow-sm"
                aria-label="Next"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};
