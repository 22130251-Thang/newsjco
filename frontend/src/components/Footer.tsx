import { Link } from "react-router-dom";
import { Phone, Mail, Rss, Facebook, Youtube } from "lucide-react";

export const Footer = () => {
  const categories = [
    "Thời sự", "Thế giới", "Kinh tế", "Xã hội", "Pháp luật",
    "Giáo dục", "Sức khỏe", "Đời sống", "Khoa học", "Số hóa",
    "Văn hóa", "Thể thao", "Giải trí", "Du lịch", "Xe"
  ];

  return (
    <footer className="bg-white border-t-4 border-[#c02424] mt-12 pb-8">
      {/* Categories Row */}
      <div className="border-b border-gray-100">
        <div className="container-main py-4">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/${cat.toLowerCase().replace(/\s/g, "-")}`}
                className="text-sm font-bold text-gray-700 hover:text-[#c02424] uppercase"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Gov Text */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container-main py-2 text-center">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
            KÊNH THÔNG TIN CỦA CHÍNH PHỦ DO TTXVN PHÁT HÀNH
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-main pt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Logo Column */}
          <div className="w-full md:w-1/3">
            <Link to="/" className="inline-block mb-3">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#c02424] font-heading uppercase leading-none">
                  BÁO TIN TỨC
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                  THÔNG TẤN XÃ VIỆT NAM
                </span>
              </div>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              © Giấy phép số 35/GP-BTTTT cấp ngày 18/1/2017.
              <br />
              Tổng Biên tập: NGUYỄN ĐỨC LỢI
              <br />
              Cấm sao chép dưới mọi hình thức nếu không có sự chấp thuận bằng văn bản.
            </p>
          </div>

          {/* Contact Column */}
          <div className="w-full md:w-1/3">
            <h4 className="font-bold text-sm text-gray-800 mb-4 uppercase border-l-2 border-[#c02424] pl-2">
              Liên hệ tòa soạn
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <MapIcon className="w-4 h-4 mt-0.5 text-[#c02424]" />
                <span>Số 5 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#c02424]" />
                <a href="tel:0914914999" className="hover:text-[#c02424]">0914.914.999</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#c02424]" />
                <a href="mailto:thuky@baotintuc.vn" className="hover:text-[#c02424]">thuky@baotintuc.vn</a>
              </li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="w-full md:w-1/3">
            <h4 className="font-bold text-sm text-gray-800 mb-4 uppercase border-l-2 border-[#c02424] pl-2">
              Kết nối với chúng tôi
            </h4>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1877f2] hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#ff0000] hover:text-white transition-all">
                <Youtube size={18} />
              </a>
              <a href="/rss" className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#ee802f] hover:text-white transition-all">
                <Rss size={18} />
              </a>
            </div>

            <div className="mt-6 p-3 bg-gray-50 rounded border border-gray-100 text-xs text-gray-500">
              Liên hệ quảng cáo: 090.xxx.xxxx
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

function MapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 21 15 18 9 21 3 18 3 6" />
      <line x1="9" x2="9" y1="3" y2="21" />
      <line x1="15" x2="15" y1="3" y2="21" />
    </svg>
  );
}
