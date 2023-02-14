import { useTheme } from "@nextui-org/react";
import CustomSvg from "./customSvg";

export default function Delete({ handler }) {
  return (
    <div title="Delete" style={{ cursor: "pointer" }}>
      <CustomSvg>
        <path d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z" />
      </CustomSvg>
    </div>
  );
}
