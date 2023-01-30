import { useTheme } from "@nextui-org/react";
import CustomSvg from "./customSvg";

export default function Bookmark({ handler }) {
  return (
    <div title="Bookmark" onClick={handler}>
      <CustomSvg>
        <path d="M6 19.5V5.625q0-.7.463-1.162Q6.925 4 7.625 4h8.75q.7 0 1.163.463.462.462.462 1.162V19.5l-6-2.575Zm1-1.55 5-2.15 5 2.15V5.625q0-.25-.188-.437Q16.625 5 16.375 5h-8.75q-.25 0-.437.188Q7 5.375 7 5.625ZM7 5h10-5Z" />
      </CustomSvg>
    </div>
  );
}
