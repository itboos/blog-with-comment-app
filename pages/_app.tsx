import "tailwindcss/tailwind.css";

import type {AppProps} from "next/app";
import Head from "next/head";
import Header from "../components/header";
// import { Auth0Provider } from '@auth0/auth0-react'
import {UserProvider} from "@auth0/nextjs-auth0/client";

export default function MyApp({Component, pageProps}: AppProps) {
  return (
    <UserProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Clone and deploy your own Next.js portfolio in minutes."
        />
        <title>My awesome blog</title>
      </Head>

      <Header />

      <main className="py-14">
        <Component {...pageProps} />
      </main>
    </UserProvider>
  );
}
