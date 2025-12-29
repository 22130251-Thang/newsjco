import { GocNhin } from "../news/GocNhin";
import { MiniFeatured } from "../news/MiniFeatured";

export const LeftSidebar = () => {
    return (
        <div className="w-[300px] space-y-6">
            <MiniFeatured />
            <GocNhin />
        </div>
    );
};
