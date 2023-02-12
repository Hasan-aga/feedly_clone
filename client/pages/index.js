import { useSession } from "next-auth/react";
import { Grid } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ContentStack from "@/components/contentStack";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export default function Profile() {
  const { data: session } = useSession();

  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["feeds"],
    queryFn: getFeeds,
    onError: (error) => toast.error(error.message),
  });

  async function getFeeds() {
    const response = await fetch("http://localhost:3000/api/feeds");

    if (!response.ok) {
      throw new Error("Something went wrong.");
    }
    return response.json();
  }

  if (session && isSuccess) {
    return <ContentStack feeds={data.results} />;
  }
}
