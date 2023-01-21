import * as React from "react";
import { SessionProvider } from "next-auth/react";

// 1. import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";

export default function App({ Component, session, pageProps }) {
  // 2. Use at the root of your app
  return (
    <NextUIProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </NextUIProvider>
  );
}
