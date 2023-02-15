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
        background: "#282a36",
        primary: "#bd93f9",
        primaryLight: "red",
        primaryLightHover: "red",
        primaryLightActive: "red",
        primaryLightContrast: "red",
        $blue50: "#4ADE7B",
        primaryBorder: "#4ADE7B",
        primaryBorderHover: "$green600",
        primarySolidHover: "$green700",
        primarySolidContrast: "$white",
        primaryShadow: "$green500",
        myColor: "white",
      },
    },
  });

  //todo: override default themes
  // if you remove NextUIProvider, themes still work since we are using default themes.

  //react query
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider theme={darkTheme}>
        <NextThemesProvider
          defaultTheme="dark"
          attribute="class"
          value={{
            light: lightTheme.className,
            dark: darkTheme.className,
          }}
        >
          <SessionProvider session={session}>
            <ErrorBoundary>
              <Toaster />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ErrorBoundary>
          </SessionProvider>
        </NextThemesProvider>
      </NextUIProvider>
    </QueryClientProvider>
  );
}
