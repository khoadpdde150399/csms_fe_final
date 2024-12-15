import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'bootstrap/dist/css/bootstrap.css';
import Head from 'next/head';
import React from 'react';
import { SessionProvider } from 'next-auth/react'; // Importing SessionProvider

import Auth from '@/components/auth';
import Layout from '@/components/layout';
import '@/styles/globals.scss';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
        },
    },
});

const App = ({ Component, pageProps }) => {
    const AuthComponent = Component.isAuth ? Auth : React.Fragment;

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
            </Head>
        <QueryClientProvider client={queryClient}>
            
            <SessionProvider session={pageProps.session}>
                <Head>
                    <title>elevenT</title>
                    <link rel="icon" href="/img/favicon.ico" />
                </Head>
                <AuthComponent>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </AuthComponent>
                {/* {process.env.NODE_ENV === 'development' && (
                    // <ReactQueryDevtools initialIsOpen={false} />
                )} */}
            </SessionProvider>
        </QueryClientProvider>
        </>
    );
};

export default App;
