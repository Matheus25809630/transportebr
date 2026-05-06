"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../../config/firebase";
import { collection, query, where, onSnapshot, DocumentData } from "firebase/firestore";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Oferta extends DocumentData {
  id: string;
  id_embarcador: string;
  chave_acesso: string;
  pesoB?: string;
  status: string;
}

export default function DashboardContent() {
  const [user, setUser] = useState<User | null>(null);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const q = query(collection(db, "Notas_Fiscais"), where("status", "==", "aguardando_coleta"));
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          setOfertas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Oferta)));
        });
        return () => unsubscribeSnapshot();
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black italic animate-pulse">TRANSPORTE BR...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <nav className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#EA1D2C] rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <span className="text-white font-black italic">T</span>
            </div>
            <span className="text-lg font-black uppercase italic tracking-tighter">Transporte BR</span>
          </Link>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Painel da Transportadora</p>
            <p className="text-[10px] font-bold text-slate-600">{user?.email}</p>
          </div>
        </div>
        <button onClick={() => signOut(auth).then(() => router.push("/"))} className="text-[10px] font-black text-slate-400 hover:text-[#EA1D2C] uppercase transition-colors">Encerrar Sessão</button>
      </nav>

      <main className="max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Cargas em Trânsito" value="14" icon="🚚" color="border-blue-500" />
          <StatCard title="Motoristas Online" value="09" icon="🟢" color="border-green-500" />
          <StatCard title="Faturamento Bruto (Mês)" value="R$ 8.420,00" icon="💰" color="border-[#EA1D2C]" />
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase italic">Mural de Ofertas</h2>
              <div className="flex items-center gap-2 bg-red-50 text-[#EA1D2C] text-[10px] font-black px-3 py-1 rounded-full uppercase">
                <span className="w-1.5 h-1.5 bg-[#EA1D2C] rounded-full animate-ping"></span> Novos Pedidos
              </div>
            </div>
            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {ofertas.length === 0 ? (
                <div className="py-20 text-center text-slate-300 font-black text-xs uppercase tracking-[0.3em]">Nenhuma oferta disponível</div>
              ) : (
                ofertas.map(carga => (
                  <div key={carga.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-lg transition-all group">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Loja: {carga.id_embarcador.slice(0, 8)}...</p>
                      <p className="font-black text-slate-900">Peso: {carga.pesoB || "8kg"} | NF: {carga.chave_acesso.slice(0, 10)}...</p>
                      <p className="text-[11px] font-bold text-[#EA1D2C] uppercase mt-1">Estimativa Frete: R$ 45,00</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-[#EA1D2C] transition-colors shadow-lg shadow-slate-200">Aceitar Frete</button>
                      <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-50 transition-colors">Contraproposta</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Gestão de Frota</h3>
                <div className="grid gap-3">
                  <MenuButton label="Cadastrar Motorista" icon="👤" />
                  <MenuButton label="Meus Veículos" icon="🚐" />
                  <MenuButton label="Roteirização Inteligente" icon="🛰️" />
                  <MenuButton label="Fiscal (CT-e / MDF-e)" icon="📄" />
                </div>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#EA1D2C] rounded-full blur-[80px] opacity-10"></div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
             <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">Provisionamento (Taxas 0.5%)</h3>
             <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">R$ 184,30</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">Próximo Fechamento: Quinzenal</p>
                </div>
                <button className="text-[10px] font-black text-[#EA1D2C] uppercase border-b-2 border-[#EA1D2C] hover:text-slate-900 transition-colors">Extrato</button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) {
  return (
    <div className={`bg-white p-6 rounded-[32px] border-b-4 ${color} shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform`}>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
      </div>
      <div className="text-2xl opacity-80">{icon}</div>
    </div>
  );
}

function MenuButton({ label, icon }: { label: string, icon: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#EA1D2C] transition-all group">
      <span className="text-[10px] font-black uppercase text-slate-300 group-hover:text-white transition-colors">{label}</span>
      <span className="text-sm">{icon}</span>
    </button>
  );
}
