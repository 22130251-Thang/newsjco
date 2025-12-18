import { CategoryFeedConfig, NewsCategory, NewsSource } from '../types';

export const FEED_CONFIGS: CategoryFeedConfig[] = [
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.MoiNhat,
    url: 'https://baotintuc.vn/tin-moi-nhat.rss',
    label: 'Trang chủ',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.ThoiSu,
    url: 'https://baotintuc.vn/thoi-su.rss',
    label: 'Thời sự',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.TheGioi,
    url: 'https://baotintuc.vn/the-gioi.rss',
    label: 'Thế giới',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.KinhTe,
    url: 'https://baotintuc.vn/kinh-te.rss',
    label: 'Kinh tế',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.XaHoi,
    url: 'https://baotintuc.vn/xa-hoi.rss',
    label: 'Xã hội',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.PhapLuat,
    url: 'https://baotintuc.vn/phap-luat.rss',
    label: 'Pháp luật',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.VanHoa,
    url: 'https://baotintuc.vn/van-hoa.rss',
    label: 'Văn hóa',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.GiaoDuc,
    url: 'https://baotintuc.vn/giao-duc.rss',
    label: 'Giáo dục',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.TheThao,
    url: 'https://baotintuc.vn/the-thao.rss',
    label: 'Thể thao',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.HoSo,
    url: 'https://baotintuc.vn/ho-so.rss',
    label: 'Hồ sơ',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.QuanSu,
    url: 'https://baotintuc.vn/quan-su.rss',
    label: 'Quân sự',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.KhoaHocCongNghe,
    url: 'https://baotintuc.vn/khoa-hoc-cong-nghe.rss',
    label: 'Khoa học - Công nghệ',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.BienDao,
    url: 'https://baotintuc.vn/bien-dao-viet-nam.rss',
    label: 'Biển đảo',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.YTe,
    url: 'https://baotintuc.vn/suc-khoe.rss',
    label: 'Y tế',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.DiaPhuong,
    url: 'https://baotintuc.vn/dia-phuong.rss',
    label: 'Địa phương',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.Anh,
    url: 'https://baotintuc.vn/anh-360.rss',
    label: 'Ảnh',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.DanTocMienNui,
    url: 'https://baotintuc.vn/giai-ma-muon-mat.rss',
    label: 'Dân tộc miền núi',
  },
  {
    source: NewsSource.BaoTinTuc,
    category: NewsCategory.InfoGraphics,
    url: 'https://baotintuc.vn/infographics.rss',
    label: 'InfoGraphics',
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
