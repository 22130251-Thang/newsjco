export const RightSidebar = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="space-y-4 px-4">
          <a href="#" className="block">
            <img
              src="https://cdnmedia.baotintuc.vn/Upload/QKrAM3u3JmfSk084HTqfEg/files/Quangcao/docbaogiay-TT.jpg"
              alt="Tuần tin tức"
              className="w-full object-contain"
            />
          </a>
          <a href="#" className="block">
            <img
              src="https://cdnmedia.baotintuc.vn/Upload/QKrAM3u3JmfSk084HTqfEg/files/Quangcao/docbaogiay-DTMN.jpg"
              alt="Báo ảnh Dân tộc và Miền núi"
              className="w-full object-contain"
            />
          </a>
        </div>
      </div>

      <div className="mt-6">
        <a href="#" className="block relative group">
          <img
            src="https://placehold.co/300x250/004d40/white?text=THE+EMERALD+GARDEN+VIEW"
            alt="Advertisement"
            className="w-full h-auto object-cover"
            width={300}
            height={250}
          />
          <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
};
