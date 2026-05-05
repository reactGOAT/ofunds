"use client";
import { LayoutProps } from "@/models/shared";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryCacheOnError, queryErrorMessage } from "../query";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export default function ProvidersClient({ children }: Readonly<LayoutProps>) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: "always",
        refetchOnReconnect: "always",
      },
    },
    queryCache: new QueryCache({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (err: any, query: any) => {
        const message = queryErrorMessage(err);
        console.log("message ==>",message)
        queryCacheOnError({ message, query });
      },
    }),
  });

  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <ThemedToaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}



// ✅ This component will have access to useTheme()
function ThemedToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      theme={theme === "dark" ? "dark" : "light"}
      closeButton
      toastOptions={{
        // className: "custom-toast",
        // descriptionClassName: "custom-toast-description",
        classNames: {
          error:"error-custom-toast",
          success: "success-custom-toast",
          closeButton:"close-button"
        }
      }}
    />
  );
}