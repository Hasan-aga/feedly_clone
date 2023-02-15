import { useSession } from "next-auth/react";
import { Grid } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ContentStack from "@/components/contentStack";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useFeeds from "@/hooks/useFeeds";

export default function Profile() {
  const { data: session } = useSession();

  const { isLoading, data, isSuccess } = useFeeds();

  async function getFeeds() {
    const response = await fetch(
      "${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_URL}/api/feeds"
    );

    if (!response.ok) {
      throw new Error("Something went wrong.");
    }
    return response.json();
  }

  if (session && isSuccess) {
    return <ContentStack feeds={data.results} />;
  }
}
