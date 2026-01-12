import { memo } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { ICON_SIZE_MD } from "./constants";

export const HomeButton = memo(() => (
    <Link
        to="/"
        className="px-3 h-full flex items-center justify-center transition-colors"
        aria-label="Home"
    >
        <Home size={ICON_SIZE_MD} fill="currentColor" />
    </Link>
));

