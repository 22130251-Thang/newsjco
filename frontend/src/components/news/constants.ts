export const NAV_HEIGHT = 40;
export const ICON_SIZE_SM = 12;
export const ICON_SIZE_MD = 18;

export interface EventLink {
    id: string;
    to: string;
    label: string;
}

export const DEFAULT_EVENTS: EventLink[] = [
    { id: "1", to: "/su-kien/1", label: "Báo Tin tức - 40 năm đổi mới" },
    { id: "2", to: "/su-kien/2", label: "Việt Nam: Kỷ nguyên mới" },
];
