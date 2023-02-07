import type { AppProps } from "next/app";

import "../style.css";
import { CssBaseline, CssVarsProvider } from "@mui/joy";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CssVarsProvider defaultMode="dark">
      <CssBaseline />
      <Component {...pageProps} />
    </CssVarsProvider>
  );
}
