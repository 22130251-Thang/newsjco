import { CategoryFeedConfig, NewsCategory, NewsSource } from '../types';

export const FEED_CONFIGS: CategoryFeedConfig[] = [
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.ThoiSu,
    url: 'https://vnexpress.net/rss/thoi-su.rss',
    label: 'Thời sự',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.TheGioi,
    url: 'https://vnexpress.net/rss/the-gioi.rss',
    label: 'Thế giới',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.KinhDoanh,
    url: 'https://vnexpress.net/rss/kinh-doanh.rss',
    label: 'Kinh doanh',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.GiaiTri,
    url: 'https://vnexpress.net/rss/giai-tri.rss',
    label: 'Giải trí',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.TheThao,
    url: 'https://vnexpress.net/rss/the-thao.rss',
    label: 'Thể thao',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.PhapLuat,
    url: 'https://vnexpress.net/rss/phap-luat.rss',
    label: 'Pháp luật',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.GiaoDuc,
    url: 'https://vnexpress.net/rss/giao-duc.rss',
    label: 'Giáo dục',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.MoiNhat,
    url: 'https://vnexpress.net/rss/tin-moi-nhat.rss',
    label: 'Tin Mới Nhất',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.NoiBat,
    url: 'https://vnexpress.net/rss/tin-noi-bat.rss',
    label: 'Tin Nổi Bật',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.SucKhoe,
    url: 'https://vnexpress.net/rss/suc-khoe.rss',
    label: 'Sức khỏe',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.CongNghe,
    url: 'https://vnexpress.net/rss/khoa-hoc-cong-nghe.rss',
    label: 'Khoa học - Công nghệ',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.DoiSong,
    url: 'https://vnexpress.net/rss/gia-dinh.rss',
    label: 'Đời sống',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.DuLich,
    url: 'https://vnexpress.net/rss/du-lich.rss',
    label: 'Du Lịch',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.Xe,
    url: 'https://vnexpress.net/rss/oto-xe-may.rss',
    label: 'Xe',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.YKien,
    url: 'https://vnexpress.net/rss/y-kien.rss',
    label: 'Ý Kiến',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.TamSu,
    url: 'https://vnexpress.net/rss/tam-su.rss',
    label: 'Tâm sự',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.Cuoi,
    url: 'https://vnexpress.net/rss/cuoi.rss',
    label: 'Cười',
  },
  {
    source: NewsSource.VnExpress,
    category: NewsCategory.TinXemNhieu,
    url: 'https://vnexpress.net/rss/tin-xem-nhieu.rss',
    label: 'Tin Xem Nhiều',
  },
];

export function getFeedsByCategory(
  category: NewsCategory,
): CategoryFeedConfig[] {
  return FEED_CONFIGS.filter((feed) => feed.category === category);
}

export function getAvailableCategories(): NewsCategory[] {
  return [...new Set(FEED_CONFIGS.map((feed) => feed.category))];
}
