import { memo } from "react";
import { Link } from "react-router-dom";
import { getVietnameseFormattedDate } from "../../lib/utils/date-utils";
import { DEFAULT_EVENTS, type EventLink } from "./constants";

interface EventsBarProps {
    events?: EventLink[];
}

export const EventsBar = memo(({ events = DEFAULT_EVENTS }: EventsBarProps) => (
    <div className="container-main bg-gray-100 dark:bg-gray-800 py-2">
        <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4 p-2">
                <span className="font-bold text-red-500 dark:text-red-400">SỰ KIỆN</span>
                <div className="flex items-center gap-2 truncate text-gray-700 dark:text-gray-300">
                    {events.map((event) => (
                        <Link
                            key={event.id}
                            to={event.to}
                            className="bg-white dark:bg-gray-700 rounded-xl px-2 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {event.label}
                        </Link>
                    ))}
                </div>
            </div>

            <time className="text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                {getVietnameseFormattedDate()}
            </time>
        </div>
    </div>
));

