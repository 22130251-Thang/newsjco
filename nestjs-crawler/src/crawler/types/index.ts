export enum NewsSource {
  VnExpress = 'VnExpress',
}

export enum NewsCategory {
  ThoiSu = 'thoi-su',
  TheGioi = 'the-gioi',
  KinhDoanh = 'kinh-doanh',
  GiaiTri = 'giai-tri',
  TheThao = 'the-thao',
  PhapLuat = 'phap-luat',
  GiaoDuc = 'giao-duc',
  SucKhoe = 'suc-khoe',
  CongNghe = 'cong-nghe',
  DoiSong = 'doi-song',
  MoiNhat = 'tin-moi-nhat',
  NoiBat = 'tin-noi-bat',
  DuLich = 'du-lich',
  Xe = 'oto-xe-may',
  YKien = 'y-kien',
  TamSu = 'tam-su',
  Cuoi = 'cuoi',
  TinXemNhieu = 'tin-xem-nhieu',
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
  category: NewsCategory;
  image: string | undefined;
  categories: string[];
  guid: string;
}
