import { useRouter } from "next/router";

export default function SpecificCategory() {
  const router = useRouter();
  const { title } = router.query;
  return <>{title}</>;
}
