import { twMerge } from "tailwind-merge";

interface ColoredTextProps {
  children: React.ReactNode;
  className?: string;
}

export const ColoredText = ({ children, className }: ColoredTextProps) => {
  const baseClasses = "text-gray-500 text-sm";
  return <p className={twMerge(baseClasses, className)}> {children}</p>;
};
