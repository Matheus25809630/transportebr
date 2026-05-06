"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../config/firebase";
import { collection, query, where, onSnapshot, updateDoc, doc, DocumentData } from "firebase/firestore";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

interface Oferta extends DocumentData {
  id: string;
  chave_acesso: string;
  id_embarcador: string;
}

export default function MotoristPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [viagemAtiva, setViagemAtiva] = useState<Oferta | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"mural" | "carteira">("mural");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Controle de Autenticação e Dados
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [router]);

  // 2. Ouvir ofertas apenas quando estiver Online e sem viagem ativa
  useEffect(() => {
    if (!isOnline || viagemAtiva || !user) {
      return;
    }

    const q = query(collection(db, "Notas_Fiscais"), where("status", "==", "aguardando_coleta"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Oferta));
      setOfertas(data);
    });

    return () => {
      unsubscribe();
      setOfertas([]);
    };
  }, [isOnline, viagemAtiva, user]);

  const handleAceitarCarga = async (carga: Oferta) => {
    if (!user) return;
    try {
      const cargaRef = doc(db, "Notas_Fiscais", carga.id);
      await updateDoc(cargaRef, {
        status: "coletando",
        id_motorista: user.uid,
        data_aceite: new Date().toISOString(),
      });
      setViagemAtiva(carga);
      alert("Carga aceita! Siga para o local de coleta.");
    } catch (error) {
      console.error("Erro ao aceitar:", error);
    }
  };

  const finalizarViagem = async () => {
    if (!viagemAtiva) return;
    try {
      const cargaRef = doc(db, "Notas_Fiscais", viagemAtiva.id);
      await updateDoc(cargaRef, { status: "entregue" });
      setViagemAtiva(null);
      alert("Entrega concluída com sucesso!");
    } catch (error) {
      console.error("Erro ao finalizar:", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-white font-black animate-pulse uppercase italic tracking-widest">Transporte BR...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans select-none">
      
      {/* HEADER: STATUS TOGGLE */}
      <header className="p-6 bg-slate-900 border-b border-white/5 sticky top-0 z-50 flex justify-between items-center backdrop-blur-md bg-opacity-80">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500 animate-ping" : "bg-red-500"}`}></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Transporte BR</span>
        </div>
        
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
            isOnline ? "bg-green-500 text-white shadow-lg shadow-green-900/40" : "bg-slate-700 text-slate-400"
          }`}
        >
          {isOnline ? "● Online" : "○ Offline"}
        </button>
      </header>

      <main className="flex-1 p-4 overflow-y-auto pb-32">
        {abaAtiva === "mural" ? (
          <>
            {/* MODO VIAGEM ATIVA */}
            {viagemAtiva ? (
              <div className="animate-in slide-in-from-bottom duration-500">
                <div className="bg-white rounded-[40px] p-8 text-slate-900 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">Viagem em Curso</span>
                    <button className="text-slate-400 font-bold text-xs">🏁 Abrir Maps</button>
                  </div>
                  
                  <h2 className="text-2xl font-black leading-tight mb-1">Coleta: {viagemAtiva.id_embarcador.slice(0, 10)}...</h2>
                  <p className="text-slate-500 font-bold text-sm mb-8 break-all">NF: {viagemAtiva.chave_acesso}</p>
                  
                  <div className="space-y-4">
                    <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg">
                      Cheguei na Coleta
                    </button>
                    <button 
                      onClick={finalizarViagem}
                      className="w-full bg-[#EA1D2C] text-white py-5 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-red-200"
                    >
                      📸 Finalizar Entrega
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* MURAL DE OFERTAS */
              <div className="space-y-4">
                {!isOnline && (
                  <div className="py-20 text-center flex flex-col items-center opacity-20">
                    <span className="text-6xl mb-4">💤</span>
                    <p className="font-black uppercase italic tracking-widest text-sm text-white">Fique online para ver fretes</p>
                  </div>
                )}
                
                {isOnline && ofertas.length === 0 && (
                  <div className="py-20 text-center opacity-40">
                    <p className="font-black uppercase tracking-widest text-xs">Buscando cargas próximas...</p>
                  </div>
                )}

                {isOnline && ofertas.map(oferta => (
                  <div key={oferta.id} className="bg-slate-800 p-6 rounded-[32px] border border-white/5 shadow-xl animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-2xl font-black text-[#EA1D2C]">R$ 45,00</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Disponível agora</div>
                    </div>
                    
                    <div className="mb-8">
                      <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Chave NF-e</p>
                      <p className="text-xs font-mono font-bold text-slate-300 break-all">{oferta.chave_acesso}</p>
                    </div>

                    <button 
                      onClick={() => handleAceitarCarga(oferta)}
                      className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#EA1D2C] hover:text-white transition-all active:scale-95 shadow-md"
                    >
                      Aceitar Coleta
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* MINHA CARTEIRA */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-[#EA1D2C] to-red-900 p-8 rounded-[40px] shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Saldo Total</p>
              <h3 className="text-4xl font-black tracking-tighter italic">R$ 1.280,00</h3>
              <button className="mt-8 bg-white text-[#EA1D2C] px-8 py-3 rounded-full text-[10px] font-black uppercase shadow-lg">Resgatar via PIX</button>
            </div>
            
            <div className="bg-slate-800 rounded-[32px] p-6 border border-white/5">
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Resumo de Hoje</h4>
              <div className="flex justify-between items-center">
                <span className="text-xl font-black">R$ 180,00</span>
                <span className="text-[10px] font-black text-green-500 uppercase bg-green-500/10 px-3 py-1 rounded-full">4 Entregas</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER: NAVEGAÇÃO DO APP */}
      <footer className="fixed bottom-6 left-6 right-6 bg-slate-800/90 backdrop-blur-xl border border-white/10 h-20 rounded-[32px] flex items-center justify-around shadow-2xl z-50">
        <button onClick={() => setAbaAtiva("mural")} className={`flex flex-col items-center gap-1 transition-colors ${abaAtiva === "mural" ? "text-[#EA1D2C]" : "text-slate-500"}`}>
          <span className="text-xl">📦</span>
          <span className="text-[8px] font-black uppercase tracking-widest">Mural</span>
        </button>
        <button onClick={() => setAbaAtiva("carteira")} className={`flex flex-col items-center gap-1 transition-colors ${abaAtiva === "carteira" ? "text-[#EA1D2C]" : "text-slate-500"}`}>
          <span className="text-xl">🏦</span>
          <span className="text-[8px] font-black uppercase tracking-widest">Ganhos</span>
        </button>
        <button onClick={() => signOut(auth)} className="flex flex-col items-center gap-1 text-slate-500">
          <span className="text-xl">🚪</span>
          <span className="text-[8px] font-black uppercase tracking-widest">Sair</span>
        </button>
      </footer>
    </div>
  );
}