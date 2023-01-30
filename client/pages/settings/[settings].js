import { Text } from "@nextui-org/react";
import { useRouter } from "next/router";

export default function Settings() {
  const router = useRouter();
  const { hello } = router.query;
  return (
    <>
      <Text color="error" h4>
        Settings {hello}
      </Text>
    </>
  );
}
