import { Link } from "react-router-dom";

export const GocNhin = () => {
    return (
        <div className="mt-6 border-t border-gray-100 bg-gray-100">
            <span className="bg-[#002e70] text-white font-bold px-2 py-1 text-sm uppercase">
                Góc nhìn
            </span>

            <Link to="/goc-nhin/tri-benh-hinh-thuc" className="p-5 block">
                <h3 className="font-bold text-gray-800 text-[17px] mb-1 group-hover:text-[#002e70] transition-colors">
                    Trị bệnh hình thức
                </h3>

                <div className="flex gap-3 items-start">
                    <p className="text-[12px] text-gray-600 flex-1 text-justify">
                        Một năm vừa qua, việc sắp xếp, tinh gọn bộ máy của hệ thống chính trị đã đạt được những kết quả đáng ghi nhận...
                    </p>
                    <div className="w-[70px] flex flex-col items-center">
                        <div className="w-[60px] h-[60px] rounded-full overflow-hidden bg-gray-200">
                            <img
                                src="https://media.baotintuc.vn/Upload/3qVxwVtNEPp6Wp9kkF77g/files/2025/12/17/ctn-10.jpg"
                                alt="Author"
                                className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};
