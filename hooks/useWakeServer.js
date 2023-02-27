// a hook that calls the server. used to start loading the server before login.

import { useEffect } from "react";

export default function useWakeServer() {
  async function callEcho() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/echo?message=hello-world`
    );

    if (!response.ok) {
      throw new Error("Something went wrong.");
    }
    return response.json();
  }

  useEffect(() => {
    console.log("calling echo");
    callEcho();
  }, []);
}
