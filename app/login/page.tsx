"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function LoginPage() {
  const [perfil, setPerfil] = useState<"cliente" | "admin">("cliente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const userDoc = await getDoc(doc(db, "Usuarios", userCredential.user.uid));
      const perfilReal = userDoc.data()?.tipo_perfil || "cliente";

      // Redirecionamento dinâmico
      if (perfilReal === "admin") router.push("/dashboard");
      else if (perfilReal === "motorista") router.push("/motorista");
      else router.push("/cliente");

    } catch (error: unknown) {
      console.error("Erro ao fazer login:", error);
      setErro("Credenciais inválidas. Verifique os dados e tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 font-sans">
      <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
        
        {/* LOGO E VOLTAR */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 bg-[#EA1D2C] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-red-900/40">
              <span className="text-white font-black text-2xl italic">T</span>
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter italic text-white">Transporte BR</span>
          </Link>
        </div>

        <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* TOGGLE DE SEGMENTAÇÃO (CLIENTE VS TRANSPORTADORA) */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 border border-slate-200">
            <button 
              onClick={() => setPerfil("cliente")}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${perfil === "cliente" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
            >
              Sou Lojista
            </button>
            <button 
              onClick={() => setPerfil("admin")}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${perfil === "admin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
            >
              Sou Empresa
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {erro && (
              <div className="bg-red-50 text-[#EA1D2C] p-4 rounded-xl text-xs font-bold flex items-center border border-red-100">
                {erro}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                {perfil === "cliente" ? "E-mail ou CPF" : "E-mail Corporativo / CNPJ"}
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#EA1D2C] focus:bg-white rounded-2xl outline-none text-slate-900 font-bold transition-all placeholder:text-slate-300"
                placeholder={perfil === "cliente" ? "exemplo@email.com" : "empresa@cnpj.com"}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">Sua Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#EA1D2C] focus:bg-white rounded-2xl outline-none text-slate-900 font-bold transition-all placeholder:text-slate-300"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={carregando}
              className="w-full bg-[#EA1D2C] text-white font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-red-100 disabled:opacity-50 active:scale-95"
            >
              {carregando ? "A Validar..." : "Acessar Plataforma"}
            </button>
          </form>

          {/* SOCIAL LOGIN */}
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] bg-slate-100 flex-1"></div>
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Ou entrar com</span>
              <div className="h-[1px] bg-slate-100 flex-1"></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <SocialButton label="Google" icon="G" />
              <SocialButton label="Apple" icon="A" />
              <SocialButton label="Gov.br" icon="Gov" color="bg-blue-600 text-white" />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="text-[10px] font-black text-[#EA1D2C] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
              Esqueceu a senha? Recuperar via WhatsApp
            </button>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-500 font-bold text-xs uppercase tracking-tighter">
          Novo no Transporte BR? <span className="text-white cursor-pointer hover:text-[#EA1D2C]">Criar conta industrial</span>
        </p>
      </div>
    </div>
  );
}

function SocialButton({ label, icon, color = "bg-slate-50 text-slate-900" }: { label: string, icon: string, color?: string }) {
  return (
    <button className={`flex flex-col items-center justify-center py-3 rounded-2xl border border-slate-100 hover:border-[#EA1D2C] transition-all group ${color}`}>
      <span className="font-black text-base">{icon}</span>
      <span className="text-[7px] font-black uppercase tracking-tighter opacity-50">{label}</span>
    </button>
  );
}