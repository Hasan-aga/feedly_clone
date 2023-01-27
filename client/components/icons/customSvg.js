import { styled, useTheme } from "@nextui-org/react";

export default function CustomSvg({
  width = "24px",
  height = "24px",
  children,
}) {
  const { theme } = useTheme();

  const Wrapper = styled("svg", {
    fill: theme.colors.primary.value,
    width,
    height,
    "&:hover": {
      fill: theme.colors.code.value,
    },
  });
  return (
    <>
      <Wrapper>{children}</Wrapper>
    </>
  );
}
