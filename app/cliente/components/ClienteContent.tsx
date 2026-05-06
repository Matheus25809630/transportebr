"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { auth, db } from "../../../config/firebase";
import { Html5QrcodeScanner } from "html5-qrcode";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy, DocumentData } from "firebase/firestore";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Message {
  role: "bot" | "user";
  text: string;
}

interface Carga extends DocumentData {
  id: string;
  chave_acesso: string;
  status: string;
  valor_base: number;
}

export default function ClienteContent() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Olá! Sou seu assistente de doca. Posso cotar um frete ou marcar uma coleta agora. O que precisa?" }
  ]);
  const [cargas, setCargas] = useState<Carga[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<null | HTMLDivElement>(null);
  const router = useRouter();

  const salvarCargaIA = useCallback(async (dados: { chave: string; valor: number }) => {
    if (!user) return;
    const taxaOculta = dados.valor * 0.005; // 0.5% faturado da transportadora
    await addDoc(collection(db, "Notas_Fiscais"), {
      chave_acesso: dados.chave,
      id_embarcador: user.uid,
      valor_base: dados.valor,
      taxa_transp: taxaOculta,
      status: "aguardando_coleta",
      data_criacao: serverTimestamp(),
    });
  }, [user]);

  const processarMensagem = useCallback(async (texto: string, imagemBase64?: string) => {
    const novasMensagens: Message[] = [...messages, { role: "user", text: texto }];
    setMessages(novasMensagens);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: novasMensagens, image: imagemBase64 }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.text }]);

      if (data.metadata?.chave) {
        await salvarCargaIA(data.metadata);
      }
    } catch (error) {
      console.error("Erro no chat:", error);
      setMessages((prev) => [...prev, { role: "bot", text: "Erro ao conectar com o cérebro do sistema." }]);
    }
  }, [messages, salvarCargaIA]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const q = query(
          collection(db, "Notas_Fiscais"),
          where("id_embarcador", "==", currentUser.uid),
          orderBy("data_criacao", "desc")
        );
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          setCargas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Carga)));
        });
        return () => unsubscribeSnapshot();
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isScanning) return;
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 120 } }, false);
    scanner.render((text) => {
      setIsScanning(false);
      processarMensagem(`Escaneei esta chave: ${text}`);
      scanner.clear();
    }, () => undefined);
    return () => { scanner.clear().catch(() => undefined); };
  }, [isScanning, processarMensagem]);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black animate-pulse uppercase italic">Transporte BR...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <nav className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#EA1D2C] rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <span className="text-white font-black italic">T</span>
            </div>
            <span className="text-lg font-black uppercase italic tracking-tighter">Transporte BR</span>
          </Link>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Lojista</p>
            <p className="text-sm font-bold">{user?.email?.split('@')[0]}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-green-50 px-3 py-1.5 rounded-full border border-green-100 hidden md:block">
            <span className="text-[10px] font-black text-green-600 uppercase">Saldo: R$ 1.250,00</span>
          </div>
          <button onClick={() => signOut(auth).then(() => router.push("/"))} className="text-[10px] font-black text-slate-400 hover:text-[#EA1D2C] uppercase transition-colors">Sair</button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <button onClick={() => setIsScanning(true)} className="bg-white p-6 rounded-[32px] border-2 border-dashed border-slate-200 hover:border-[#EA1D2C] transition-all flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-red-50 transition-colors">📸</div>
              <span className="font-black uppercase text-xs tracking-widest text-slate-600 group-hover:text-[#EA1D2C]">Ler Nota Fiscal</span>
            </button>
            <button className="bg-white p-6 rounded-[32px] border-2 border-dashed border-slate-200 hover:border-[#EA1D2C] transition-all flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">📍</div>
              <span className="font-black uppercase text-xs tracking-widest text-slate-600">Minha Localização</span>
            </button>
          </div>

          <div className="bg-slate-200 h-[400px] rounded-[48px] relative overflow-hidden shadow-inner border-4 border-white">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Rastreamento GPS em tempo real</p>
            </div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/50">
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-lg">🚚</div>
              <div>
                <p className="text-[9px] font-black text-[#EA1D2C] uppercase">Motorista Selecionado</p>
                <p className="text-sm font-bold">Chegada prevista na doca: 14 min</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-[40px] flex flex-col h-[450px] shadow-2xl overflow-hidden border border-white/10">
            <div className="p-5 border-b border-white/5 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black uppercase text-white tracking-widest">Assistente IA Ativo</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-bold leading-relaxed ${
                    msg.role === "user" ? "bg-[#EA1D2C] text-white rounded-br-none" : "bg-slate-800 text-slate-300 rounded-bl-none border border-white/5"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isScanning && <div id="reader" className="w-full overflow-hidden rounded-2xl border-2 border-[#EA1D2C] bg-white"></div>}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-white/5">
              <input
                type="text"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    processarMensagem(target.value);
                    target.value = '';
                  }
                }}
                placeholder="Falar com a IA..."
                className="w-full bg-slate-800 border border-white/10 rounded-2xl px-4 py-3 text-[11px] text-white font-bold outline-none focus:border-[#EA1D2C] transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-200 flex-1 p-6 shadow-sm overflow-hidden flex flex-col">
            <h3 className="text-xs font-black uppercase mb-4 tracking-widest text-slate-400">Minhas Cargas</h3>
            <div className="space-y-3 overflow-y-auto pr-2">
              {cargas.length === 0 ? (
                <p className="text-[10px] text-slate-400 text-center py-10 font-bold">Nenhuma nota enviada.</p>
              ) : (
                cargas.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center hover:border-red-100 transition-colors cursor-pointer">
                    <div>
                      <p className="text-[10px] font-black text-slate-900">ID: #{c.id.slice(0,4)}</p>
                      <p className="text-[9px] font-medium text-slate-500">NF: {c.chave_acesso.slice(0,10)}...</p>
                    </div>
                    <span className="text-[8px] font-black uppercase px-2 py-1 bg-white rounded-full text-[#EA1D2C] border border-red-50">{c.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
