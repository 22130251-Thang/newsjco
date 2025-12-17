export enum NewsSource {
  BaoTinTuc = 'BaoTinTuc',
}

export enum NewsCategory {
  MoiNhat = 'tin-moi-nhat',
  ThoiSu = 'thoi-su',
  TheGioi = 'the-gioi',
  KinhTe = 'kinh-te',
  XaHoi = 'xa-hoi',
  PhapLuat = 'phap-luat',
  VanHoa = 'van-hoa',
  GiaoDuc = 'giao-duc',
  TheThao = 'the-thao',
  HoSo = 'ho-so',
  QuanSu = 'quan-su',
  KhoaHocCongNghe = 'khoa-hoc-cong-nghe',
  BienDao = 'bien-dao-viet-nam',
  YTe = 'suc-khoe',
  DiaPhuong = 'dia-phuong',
}

export interface CategoryFeedConfig {
  source: NewsSource;
  category: NewsCategory;
  url: string;
  label: string;
}

export interface UnifiedNewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content: string;
  fullContent: string;
  author?: string;
  source: NewsSource;
  slug: string;
  category: NewsCategory;
  image: string | undefined;
  categories: string[];
  guid: string;
}
