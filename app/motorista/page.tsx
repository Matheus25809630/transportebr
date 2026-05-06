"use client";

import dynamic from "next/dynamic";

const MotoristaContent = dynamic(() => import("./components/MotoristaContent"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black animate-pulse uppercase italic">Carregando Painel...</div>
});

export default function MotoristaPage() {
  return <MotoristaContent />;
}
