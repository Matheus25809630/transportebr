"use client";

import dynamic from "next/dynamic";

const ClienteContent = dynamic(() => import("./components/ClienteContent"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black animate-pulse uppercase italic">Carregando Painel...</div>
});

export default function ClientePage() {
  return <ClienteContent />;
}
