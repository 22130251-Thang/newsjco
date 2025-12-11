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
    source: NewsSource.ThanhNien,
    category: NewsCategory.ThoiSu,
    url: 'https://thanhnien.vn/rss/thoi-su.rss',
    label: 'Thời sự',
  },
  {
    source: NewsSource.ThanhNien,
    category: NewsCategory.TheGioi,
    url: 'https://thanhnien.vn/rss/the-gioi.rss',
    label: 'Thế giới',
  },
  {
    source: NewsSource.ThanhNien,
    category: NewsCategory.KinhDoanh,
    url: 'https://thanhnien.vn/rss/kinh-te.rss',
    label: 'Kinh tế',
  },
  {
    source: NewsSource.ThanhNien,
    category: NewsCategory.GiaiTri,
    url: 'https://thanhnien.vn/rss/doi-song/giai-tri.rss',
    label: 'Giải trí',
  },
  {
    source: NewsSource.ThanhNien,
    category: NewsCategory.TheThao,
    url: 'https://thanhnien.vn/rss/the-thao.rss',
    label: 'Thể thao',
  },
  {
    source: NewsSource.ThanhNien,
    category: NewsCategory.GiaoDuc,
    url: 'https://thanhnien.vn/rss/giao-duc.rss',
    label: 'Giáo dục',
  },
  {
    source: NewsSource.ThanhNien,
    category: NewsCategory.SucKhoe,
    url: 'https://thanhnien.vn/rss/suc-khoe.rss',
    label: 'Sức khỏe',
  },
  {
    source: NewsSource.ThanhNien,
    category: NewsCategory.CongNghe,
    url: 'https://thanhnien.vn/rss/cong-nghe.rss',
    label: 'Công nghệ',
  },
  {
    source: NewsSource.ThanhNien,
    category: NewsCategory.DoiSong,
    url: 'https://thanhnien.vn/rss/doi-song.rss',
    label: 'Đời sống',
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
