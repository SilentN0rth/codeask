import { HeroUIProvider, ToastProvider } from '@heroui/react';
import type { Metadata, Viewport } from 'next';
import { ReactNode, Suspense } from 'react';
import { Inter } from 'next/font/google';
import dynamicImport from 'next/dynamic';
import '@/styles/globals.css';
import '@/styles/tinymce.css';
import Navbar from '@/components/layout/Navbar/Navbar';
import Head from 'next/head';
import { SidebarProvider } from 'context/LeftSidebarContext';
import LeftSidebar from '@/components/layout/Sidebar/LeftSidebar';
import { AuthProvider } from 'context/useAuthContext';
import { getNewestQuestions } from '@/services/server/questions';
import { getTags } from '@/services/server/tags';
import { getTopUsers } from '@/services/server/users';
import GlobalLoadingWrapper from '@/components/layout/GlobalLoadingWrapper';

const RightSidebar = dynamicImport(
  () => import('@/components/layout/Sidebar/RightSidebar'),
  {
    loading: () => <div className="bg-cBgDark-800 w-64 animate-pulse" />,
  }
);

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CodeAsk - Platforma Q&A',
  description:
    'Platforma pytań i odpowiedzi dla programistów. Zadawaj pytania, dziel się wiedzą i rozwijaj się razem z społecznością.',
  keywords:
    'programowanie, pytania, odpowiedzi, kod, developer, frontend, backend, react, nextjs, typescript',
  authors: [{ name: 'CodeAsk Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'CodeAsk - Platforma Q&A',
    description: 'Platforma pytań i odpowiedzi dla programistów',
    type: 'website',
    locale: 'pl_PL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeAsk - Platforma Q&A',
    description: 'Platforma pytań i odpowiedzi dla programistów',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { tags } = await getTags();
  const { questions } = await getNewestQuestions();
  const topUsers = await getTopUsers(3);

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.tiny.cloud/1/9vuhbur4xx3z8mk5q8q8q8q8q8q8q8q/ui/oxide-dark/content.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/shiki@latest/dist/themes/github-dark.css"
        />
      </Head>
      <body
        className={`${inter.variable} ${inter.className} flex flex-col font-sans`}
      >
        <HeroUIProvider>
          <ToastProvider placement="bottom-right" />
          <AuthProvider>
            <GlobalLoadingWrapper>
              <SidebarProvider>
                <Navbar questions={questions} tags={tags} />
                <div className="relative flex size-full">
                  <aside>
                    <LeftSidebar topUsers={topUsers} />
                  </aside>
                  <main className="text-cTextDark-100 min-h-svh w-full flex-1 px-6 pt-[120px] pb-16">
                    {children}
                  </main>
                  <Suspense
                    fallback={
                      <div className="bg-cBgDark-800 w-64 animate-pulse" />
                    }
                  >
                    <RightSidebar questions={questions} tags={tags} />
                  </Suspense>
                </div>
              </SidebarProvider>
            </GlobalLoadingWrapper>
          </AuthProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
