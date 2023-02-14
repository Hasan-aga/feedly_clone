import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export default function useFeeds() {
  async function getFeeds() {
    const response = await fetch("/api/feeds");

    if (!response.ok) {
      throw new Error("Something went wrong.");
    }
    return response.json();
  }

  const result = useQuery({
    queryKey: ["feeds"],
    queryFn: getFeeds,
    onError: (error) => toast.error(error.message),
  });

  return result;
}
