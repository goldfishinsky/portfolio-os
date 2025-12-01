'use client';

import dynamic from 'next/dynamic';

const Desktop = dynamic(() => import('@/components/Desktop').then(mod => mod.Desktop), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen bg-black flex items-center justify-center text-white">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <Desktop />
    </main>
  );
}
