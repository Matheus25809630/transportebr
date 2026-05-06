"use client";

import dynamic from "next/dynamic";

const DashboardContent = dynamic(() => import("./components/DashboardContent"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black italic animate-pulse">Carregando Dashboard...</div>
});

export default function DashboardPage() {
  return <DashboardContent />;
}
