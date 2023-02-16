import { styled, useTheme } from "@nextui-org/react";

export default function CustomSvg({
  fill = "$primary",
  width = "24px",
  height = "24px",
  children,
}) {
  const { theme } = useTheme();

  const Wrapper = styled("svg", {
    fill,
    width,
    height,
    "&:hover": {
      fill: theme.colors.code.value,
    },
  });
  return (
    <>
      <Wrapper viewBox="0 0 24 24">{children}</Wrapper>
    </>
  );
}
