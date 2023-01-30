import { styled, useTheme } from "@nextui-org/react";
import CustomSvg from "./customSvg";

export default function Checkmark() {
  return (
    <div
      title="Mark as read"
      onClick={(e) => {
        e.stopPropagation();
        console.log("marked as read");
      }}
    >
      <CustomSvg>
        <path d="m9.55 17.3-4.975-4.95.725-.725 4.25 4.25 9.15-9.15.725.725Z" />
      </CustomSvg>
    </div>
  );
}
