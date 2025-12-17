import { GocNhin } from "./GocNhin";
import { MiniFeatured } from "./MiniFeatured";

export const LeftSidebar = () => {
    return (
        <div className="w-[300px] space-y-6">
            <MiniFeatured />
            <GocNhin />
        </div>
    );
};
