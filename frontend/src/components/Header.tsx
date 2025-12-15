import { Bell, UserCircle } from "lucide-react";
import { getVietnameseFormattedDate } from "../lib/utils/date-utils";
import { ColoredText } from "./Colored-text-";

export const Header = () => {
  return (
    <header className="max-w-[1200px] mx-auto flex justify-between my-1">
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center text-xl border-e border-gray-300 p-5 h-[10%]">
          <p> Logo</p>
        </div>
        <div className="flex justify-center items-center p-2">
          <ColoredText>{getVietnameseFormattedDate()}</ColoredText>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-center text-xl border-e border-gray-300 p-5 h-[10%]">
          <ColoredText>Mới nhất</ColoredText>
        </div>
        <div className="flex justify-center items-center gap-2 p-2 cursor-pointer">
          <UserCircle className="text-gray-500" />
          <ColoredText>Đăng nhập</ColoredText>
        </div>
        <div className="flex justify-center items-center gap-2 p-2 cursor-pointer">
          <Bell className="text-gray-500" />
        </div>
      </div>
    </header>
  );
};
