import { HeroUIProvider, ToastProvider } from '@heroui/react';
import type { Metadata, Viewport } from 'next';
import { ReactNode, Suspense } from 'react';
import { Inter } from 'next/font/google';
import dynamicImport from 'next/dynamic';
import '@/styles/globals.css';
import Navbar from '@/components/layout/Navbar/Navbar';
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
    loading: () => <div className="w-64 animate-pulse bg-cBgDark-800" />,
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
                  <main className="min-h-svh w-full flex-1 px-6 pb-16 pt-[120px] text-cTextDark-100">
                    {children}
                  </main>
                  <Suspense
                    fallback={
                      <div className="w-64 animate-pulse bg-cBgDark-800" />
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
