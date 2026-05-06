import Link from 'next/link';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-900">
      <div className="max-w-3xl bg-white rounded-[40px] p-10 shadow-2xl border border-slate-200 text-center">
        <h1 className="text-4xl font-black uppercase mb-4">Privacidade</h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Sua privacidade é importante para nós. Não compartilhamos dados de login ou NF-e sem autorização e usamos o Firebase apenas para autenticação e armazenamento seguro.
        </p>
        <Link href="/" className="inline-flex px-8 py-4 bg-[#EA1D2C] text-white font-black uppercase tracking-widest rounded-full hover:bg-slate-900 transition-all">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
