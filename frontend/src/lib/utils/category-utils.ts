export const categoryNameMap: Record<string, string> = {
    "thoi-su": "Thời sự",
    "the-gioi": "Thế giới",
    "kinh-te": "Kinh tế",
    "xa-hoi": "Xã hội",
    "phap-luat": "Pháp luật",
    "van-hoa": "Văn hóa",
    "giao-duc": "Giáo dục",
    "the-thao": "Thể thao",
    "ho-so": "Hồ sơ",
    "quan-su": "Quân sự",
    "khoa-hoc-cong-nghe": "Khoa học - Công nghệ",
    "bien-dao-viet-nam": "Biển đảo Việt Nam",
    "y-te": "Y tế",
    "dia-phuong": "Địa phương",
    "kinh-doanh": "Kinh doanh",
    "suc-khoe": "Sức khỏe",
    "giai-tri": "Giải trí",
    "doi-song": "Đời sống",
    "video": "Video",
    "anh": "Ảnh",
    "infographics": "Infographics",
    "giai-ma-muon-mat": "Giải mã muôn mặt",
    "tin-moi-nhat": "Tin mới nhất",
};

export const getCategoryName = (slug: string): string => {
    return categoryNameMap[slug] || slug.replace(/-/g, " ");
};

export const getCategoryNameUppercase = (slug: string): string => {
    return getCategoryName(slug).toUpperCase();
};
