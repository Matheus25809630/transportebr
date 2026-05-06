"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";

export default function RegistroPage() {
  const [perfil, setPerfil] = useState<"cliente" | "admin">("admin"); // Padrão admin para o seu teste
  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState(""); // CPF ou CNPJ
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      // 1. Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2. Criar documento de perfil no Firestore
      await setDoc(doc(db, "Usuarios", uid), {
        nome: nome,
        documento: documento,
        email: email,
        tipo_perfil: perfil, // "admin" para transportadora, "cliente" para lojista
        data_cadastro: new Date().toISOString(),
        status: "ativo"
      });

      alert(`Conta de ${perfil === "admin" ? "Transportadora" : "Lojista"} criada com sucesso!`);
      
      // Redireciona para o painel correspondente
      router.push(perfil === "admin" ? "/dashboard" : "/cliente");

    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      alert("Erro ao criar conta: " + message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[500px]">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#EA1D2C] rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40">
              <span className="text-white font-black text-2xl italic">T</span>
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter italic text-white">Transporte BR</span>
          </Link>
          <h1 className="text-white text-xl font-bold italic uppercase tracking-widest">Nova Conta de Teste</h1>
        </div>

        <div className="bg-white rounded-[40px] p-10 shadow-2xl">
          
          {/* SELETOR DE PERFIL */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
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
              Sou Transportadora
            </button>
          </div>

          <form onSubmit={handleRegistro} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                {perfil === "admin" ? "Razão Social / Nome Fantasia" : "Nome Completo"}
              </label>
              <input 
                type="text" 
                required 
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#EA1D2C] rounded-2xl outline-none font-bold"
                placeholder="Ex: Transportadora de Teste LTDA"
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                {perfil === "admin" ? "CNPJ" : "CPF"}
              </label>
              <input 
                type="text" 
                required 
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#EA1D2C] rounded-2xl outline-none font-bold"
                placeholder="00.000.000/0001-00"
                onChange={(e) => setDocumento(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">E-mail de Acesso</label>
              <input 
                type="email" 
                required 
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#EA1D2C] rounded-2xl outline-none font-bold"
                placeholder="teste@transportadora.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Senha</label>
              <input 
                type="password" 
                required 
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#EA1D2C] rounded-2xl outline-none font-bold"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={carregando}
              className="w-full bg-[#EA1D2C] text-white font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-red-100 disabled:opacity-50"
            >
              {carregando ? "Criando Conta..." : "Finalizar Registo"}
            </button>
          </form>

          <p className="text-center mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Ao registar-se, concorda com os termos industriais.
          </p>
        </div>
      </div>
    </div>
  );
}