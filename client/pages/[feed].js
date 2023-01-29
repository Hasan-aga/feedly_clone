import { useRouter } from "next/router";

export default function SpecificFeed() {
  const router = useRouter();
  const { feed } = router.query;

  return <p>Post: {feed}</p>;
}
