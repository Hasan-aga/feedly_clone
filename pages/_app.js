import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Layout from "@/components/layout";
import ErrorBoundary from "@/components/errorBoundry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "./_app.style.css";
import AuthenticationWrapper from "@/components/AuthenticationWrapper";
export default function App({ Component, session, pageProps }) {
  const lightTheme = createTheme({
    type: "light",
    theme: {
      colors: {
        // brand colors
        background: "#DDE5B6",
        backgroundAlpha: "rgba(254, 250, 224, 0.7)",
        foreground: "#283618",
        backgroundContrast: "#ADC178",
        white: "#111",
        blue400: "#F0EAD2",
        blue500: "rgba(160, 167, 136, 0.7)",
        blue600: "#606C38",
        blue700: "#a0a788",
      },
    },
  });

  const darkTheme = createTheme({
    type: "dark",
    theme: {
      colors: {
        // brand colors
        background: "#000037",
        backgroundAlpha: "#00005c",
        foreground: "#F0CAA3",
        backgroundContrast: "#3B185F",
        white: "#e6e6ef",
        blue400: "#000040",
        blue500: "rgba(137, 116, 159, 0.7)",
        blue600: "#89749f",
        blue700: "#9d8caf",
      },
    },
  });

  //react query
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <NextThemesProvider
            defaultTheme="dark"
            attribute="class"
            value={{
              light: lightTheme.className,
              dark: darkTheme.className,
            }}
          >
            <ErrorBoundary>
              <Toaster />
              <AuthenticationWrapper>
                <Component {...pageProps} />
              </AuthenticationWrapper>
            </ErrorBoundary>
          </NextThemesProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
