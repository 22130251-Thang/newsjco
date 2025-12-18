import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export const Footer = () => {
  const categories = [
    "THỜI SỰ", "THẾ GIỚI", "KINH TẾ", "XÃ HỘI", "PHÁP LUẬT",
    "VĂN HÓA", "GIÁO DỤC", "THỂ THAO", "HỒ SƠ", "QUÂN SỰ",
    "KHOA HỌC - CÔNG NGHỆ", "BIỂN ĐẢO", "Y TẾ", "ĐỊA PHƯƠNG", "VIDEO"
  ];

  return (
    <footer className="mt-12">
      <div className="border-t border-b border-gray-200 bg-white">
        <div className="container-main">
          <div className="flex flex-wrap items-center gap-x-4 py-2">
            <Link to="/" className="text-gray-500 hover:text-[#c02424]">
              <Home size={16} />
            </Link>
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={`/${cat.toLowerCase().replace(/\s/g, "-")}`}
                className="text-[11px] font-bold text-gray-600 hover:text-[#c02424] uppercase"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="py-8 bg-white">
        <div className="container-main text-center mb-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase">
            KÊNH THÔNG TIN CỦA CHÍNH PHỦ DO TTXVN PHÁT HÀNH
          </h3>
        </div>

        <div className="container-main">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-[400px] shrink-0">
              <div className="mb-4">
                <img
                  src="https://baotintuc.vn/Images/logo_footer.png"
                  alt="Báo Tin Tức"
                  className="h-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-[#c02424] font-heading uppercase leading-none">
                    tin tức
                  </span>
                  <span className="text-sm font-bold text-[#0066b3] uppercase tracking-widest border-t border-[#c02424] mt-1 pt-1 w-max">
                    TTXVN
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-800 space-y-1">
                <p><span className="font-bold">Tổng biên tập:</span> Ninh Hồng Nga</p>
                <p><span className="font-bold">Phó Tổng biên tập:</span> Nguyễn Trọng Chính, Phạm Thị Tuyết,</p>
                <p>Phạm Thuỳ Hương, Đinh Quang Dũng</p>
              </div>
            </div>

            <div className="flex-1 text-sm text-gray-700 space-y-2">
              <p>Giấy phép số 20/GP-BTTTT cấp ngày 18-4-2025.</p>
              <p><span className="font-bold">Trụ sở chính:</span> Số 5 Lý Thường Kiệt, phường Cửa Nam, Hà Nội</p>
              <p><span className="font-bold">Điện thoại:</span> 024 38248605/39330335; Fax: 024 38253753</p>
              <p><span className="font-bold">Phòng đại diện tại TP Hồ Chí Minh:</span> 116 - 118 Nguyễn Thị Minh Khai, phường Xuân Hoà,</p>
              <p><span className="font-bold">Điện thoại:</span> 028 39303464</p>
              <p><span className="font-bold">Email:</span> toasoantintuc@gmail.com</p>
              <p className="mt-4 text-gray-500">
                © Bản quyền thuộc về Báo Tin tức và Dân tộc - TTXVN
                <br />
                Cấm sao chép dưới mọi hình thức nếu không có sự chấp thuận bằng văn bản.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
