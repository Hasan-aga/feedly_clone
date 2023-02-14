import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Layout from "@/components/layout";
import ErrorBoundary from "@/components/errorBoundry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export default function App({ Component, session, pageProps }) {
  // 2. Use at the root of your app
  const lightTheme = createTheme({
    type: "light",
    theme: {},
  });

  const darkTheme = createTheme({
    type: "dark",
    theme: {
      colors: {
        // brand colors
        background: "#1d1d1d",
        text: "#3848",
        primaryLight: "$green200",
        primaryLightHover: "$green300",
        primaryLightActive: "$green400",
        primaryLightContrast: "$green600",
        primary: "#4ADE7B",
        primaryBorder: "$green500",
        primaryBorderHover: "$green600",
        primarySolidHover: "$green700",
        primarySolidContrast: "$white",
        primaryShadow: "$green500",
        myColor: "white",
      },
    },
  });

  //react query
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        defaultTheme="dark"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider theme={darkTheme}>
          <SessionProvider session={session}>
            <ErrorBoundary>
              <Toaster />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ErrorBoundary>
          </SessionProvider>
        </NextUIProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
