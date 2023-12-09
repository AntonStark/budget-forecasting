import Head from "next/head";

import "@/styles/common.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Бюджет</title>
                <link rel="shortcut icon" href="/icon.svg" />
            </Head>
            <Component {...pageProps} />
        </>
    )
}
