"use client";

import Link from 'next/link';
import { useState } from 'react';
import { cidadesPorEstado } from './utils/cidades';
import MapaBrasil from './components/MapaBrasil';

function SeletorCidade({ valor, onChange, placeholder, focado, clicado, setClicado }: { valor: string; onChange: (cidade: string) => void; placeholder: string; focado?: boolean; clicado: boolean; setClicado: (v: boolean) => void }) {
  const [estadoSelecionado, setEstadoSelecionado] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  const handleSelecionarEstado = (estado: string) => {
    setEstadoSelecionado(estado);
    setBusca('');
  };

  const handleSelecionarCidade = (cidade: string) => {
    onChange(cidade);
    setClicado(false);
    setEstadoSelecionado(null);
    setBusca('');
  };

  const handleVoltar = () => {
    setEstadoSelecionado(null);
    setBusca('');
  };

  const handleFechar = () => {
    setClicado(false);
    setEstadoSelecionado(null);
    setBusca('');
  };

  const cidadesFiltradas = estadoSelecionado
    ? (cidadesPorEstado[estadoSelecionado] || []).filter(c =>
        c.toLowerCase().includes(busca.toLowerCase())
      )
    : [];

  return (
    <div className="flex-1 w-full relative">
      <div
        onClick={() => setClicado(true)}
        className={`w-full bg-slate-800/50 border-2 ${focado ? 'border-[#EA1D2C]' : 'border-transparent'} rounded-2xl px-6 py-4 font-bold text-sm text-white cursor-pointer hover:bg-slate-700/50 transition-all flex justify-between items-center`}
      >
        <span className="truncate">
          {valor || <span className="text-slate-500">{placeholder}</span>}
        </span>
        <span className="text-slate-400 text-xs">▼</span>
      </div>

      {clicado && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={handleFechar}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">
                  {estadoSelecionado ? `Cidades de ${estadoSelecionado}` : "Selecione o Estado"}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {estadoSelecionado && (
                  <button onClick={handleVoltar} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all">
                    ← Voltar
                  </button>
                )}
                <button onClick={handleFechar} className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-red-600 text-white rounded-full transition-colors text-lg">✕</button>
              </div>
            </div>

            {estadoSelecionado && (
              <div className="px-8 py-4 bg-slate-900 border-b border-slate-800">
                <input
                  type="text"
                  placeholder="Buscar cidade..."
                  className="w-full px-6 py-4 bg-slate-800 border-2 border-transparent focus:border-[#EA1D2C] rounded-2xl outline-none font-bold text-sm text-white transition-all"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-900">
              {!estadoSelecionado ? (
                <div className="max-w-2xl mx-auto">
                  <MapaBrasil onStateClick={handleSelecionarEstado} selectedState={estadoSelecionado} />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cidadesFiltradas.map((cidade) => (
                    <button
                      key={cidade}
                      onClick={() => handleSelecionarCidade(cidade)}
                      className="px-6 py-4 bg-slate-800 border-2 border-slate-700 hover:border-[#EA1D2C] hover:bg-slate-700 rounded-2xl text-sm font-bold text-white transition-all text-left flex justify-between items-center group"
                    >
                      {cidade}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#EA1D2C]">→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [tipoEnvio, setTipoEnvio] = useState('');
  const [passo, setPasso] = useState(1); // 1: Origem, 2: Destino, 3: Detalhes

  const [seletorOrigemAberto, setSeletorOrigemAberto] = useState(false);
  const [seletorDestinoAberto, setSeletorDestinoAberto] = useState(false);

  const handleVerPrecos = () => {
    if (!origem || !destino || !tipoEnvio) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    alert(`Cotação enviada para IA: de ${origem} para ${destino}`);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans text-slate-100 selection:bg-[#EA1D2C] selection:text-white">
      
      {/* 1. HEADER INDUSTRIAL DARK */}
      <header className="bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EA1D2C] rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20 rotate-3">
              <span className="text-white font-black text-2xl italic leading-none">T</span>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-white">Transporte BR</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#rastreio" className="hover:text-white transition-colors">Rastrear</a>
            <a href="#lojistas" className="hover:text-white transition-colors">Lojistas</a>
            <a href="#parceiros" className="hover:text-white transition-colors">Transportadoras</a>
          </nav>

          <Link href="/login">
            <button className="px-8 py-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#EA1D2C] hover:text-white transition-all shadow-xl shadow-white/5">
              Acessar Painel
            </button>
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION COM MAPA EM DESTAQUE */}
      <section className="relative py-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
        {/* Efeitos de Fundo */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EA1D2C]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">

          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-block px-4 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EA1D2C]">Logística 4.0</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] uppercase italic">
              O futuro do frete <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA1D2C] to-red-500">é industrial.</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-xl leading-relaxed">
              Conectamos sua carga à maior malha de transporte do Brasil com precisão fiscal, rastreio militar e IA de última geração.
            </p>

            {/* WIDGET DE COTAÇÃO INDUSTRIAL */}
            <div className="bg-slate-900/50 backdrop-blur-2xl p-6 rounded-[40px] border border-slate-800 shadow-3xl space-y-4">
              <div className="flex gap-4">
                 <button onClick={() => setPasso(1)} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest border-b-2 transition-all ${passo === 1 ? 'border-[#EA1D2C] text-white' : 'border-transparent text-slate-500'}`}>01. Origem</button>
                 <button onClick={() => setPasso(2)} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest border-b-2 transition-all ${passo === 2 ? 'border-[#EA1D2C] text-white' : 'border-transparent text-slate-500'}`}>02. Destino</button>
                 <button onClick={() => setPasso(3)} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest border-b-2 transition-all ${passo === 3 ? 'border-[#EA1D2C] text-white' : 'border-transparent text-slate-500'}`}>03. Carga</button>
              </div>

              {passo === 1 && (
                <div className="animate-in fade-in zoom-in duration-300">
                  <SeletorCidade
                    valor={origem}
                    onChange={(v) => {setOrigem(v); setPasso(2)}}
                    placeholder="De onde sai a carga?"
                    focado
                    clicado={seletorOrigemAberto}
                    setClicado={setSeletorOrigemAberto}
                  />
                </div>
              )}
              {passo === 2 && (
                <div className="animate-in fade-in zoom-in duration-300">
                  <SeletorCidade
                    valor={destino}
                    onChange={(v) => {setDestino(v); setPasso(3)}}
                    placeholder="Para onde vai?"
                    focado
                    clicado={seletorDestinoAberto}
                    setClicado={setSeletorDestinoAberto}
                  />
                </div>
              )}
              {passo === 3 && (
                <div className="flex flex-col md:flex-row gap-3 animate-in fade-in zoom-in duration-300">
                  <select
                    className="flex-1 bg-slate-800/50 border-2 border-transparent rounded-2xl px-6 py-4 font-bold text-sm text-white outline-none focus:border-[#EA1D2C] appearance-none"
                    value={tipoEnvio}
                    onChange={(e) => setTipoEnvio(e.target.value)}
                  >
                    <option value="">Tipo de Envio</option>
                    <option value="Fracionado">📦 Fracionado</option>
                    <option value="Paletizado">🏢 Paletizado</option>
                    <option value="Documentos">📄 Documentos</option>
                  </select>
                  <button onClick={handleVerPrecos} className="px-10 py-4 bg-[#EA1D2C] text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-red-900/20">
                    Ver Preços
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MAPA INTERATIVO EM DESTAQUE NA HERO */}
          <div className="hidden lg:block relative animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="absolute inset-0 bg-blue-500/10 blur-[150px] rounded-full"></div>
            <div className="relative bg-slate-900/40 backdrop-blur-sm p-10 rounded-[60px] border border-slate-800 shadow-inner">
               <div className="flex justify-between items-center mb-8">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Monitoramento Nacional</h4>
                    <p className="text-white font-bold">Cobertura em tempo real</p>
                  </div>
                  <div className="flex gap-2">
                     <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                     <span className="text-[10px] font-black text-green-500 uppercase">Live</span>
                  </div>
               </div>
               <div className="h-[450px]">
                 <MapaBrasil onStateClick={(s) => {
                    if (passo === 1) {
                      setOrigem(s);
                      setSeletorOrigemAberto(true);
                    } else if (passo === 2) {
                      setDestino(s);
                      setSeletorDestinoAberto(true);
                    }
                 }} selectedState={passo === 1 ? origem : destino} />
               </div>
               <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-800/30 rounded-3xl">
                     <p className="text-[10px] font-black text-slate-500 uppercase">Estados</p>
                     <p className="text-lg font-black text-white">27</p>
                  </div>
                  <div className="text-center p-4 bg-slate-800/30 rounded-3xl">
                     <p className="text-[10px] font-black text-slate-500 uppercase">Cidades</p>
                     <p className="text-lg font-black text-white">5.5k+</p>
                  </div>
                  <div className="text-center p-4 bg-slate-800/30 rounded-3xl">
                     <p className="text-[10px] font-black text-slate-500 uppercase">Trucks</p>
                     <p className="text-lg font-black text-white">12k</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO DE VALOR (DARK CARDS) */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        
        <div id="lojistas" className="group bg-slate-900/50 p-12 rounded-[56px] border border-slate-800 hover:border-[#EA1D2C] transition-all duration-500">
          <div className="w-20 h-20 bg-slate-800 rounded-[28px] flex items-center justify-center mb-8 group-hover:bg-[#EA1D2C] transition-colors duration-500">
             <svg className="w-10 h-10 text-[#EA1D2C] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <h3 className="text-4xl font-black uppercase italic mb-6">Para Lojistas</h3>
          <p className="text-slate-400 font-medium mb-10 leading-relaxed">Automatize seu checkout com fretes inteligentes e acompanhe tudo via GPS.</p>
          <Link href="/registro" className="inline-block px-10 py-5 bg-white text-slate-900 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-[#EA1D2C] hover:text-white transition-all shadow-xl shadow-white/5">
            Cadastrar Minha Loja
          </Link>
        </div>

        <div id="parceiros" className="group bg-slate-900/50 p-12 rounded-[56px] border border-slate-800 hover:border-white transition-all duration-500">
          <div className="w-20 h-20 bg-slate-800 rounded-[28px] flex items-center justify-center mb-8 group-hover:bg-white transition-colors duration-500">
             <svg className="w-10 h-10 text-white group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1" /></svg>
          </div>
          <h3 className="text-4xl font-black uppercase italic mb-6">Para Parceiros</h3>
          <p className="text-slate-400 font-medium mb-10 leading-relaxed">Elimine viagens vazias e receba pagamentos antecipados em cada coleta.</p>
          <Link href="/registro" className="inline-block px-10 py-5 bg-slate-800 text-white rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-slate-900 transition-all">
            Ser uma Transportadora
          </Link>
        </div>
      </section>

      {/* FOOTER INDUSTRIAL */}
      <footer className="bg-slate-900/80 border-t border-slate-800 py-16 px-6 text-center mt-20">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="flex justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            <Link href="/sobre" className="hover:text-white">Sobre</Link>
            <Link href="/suporte" className="hover:text-white">Suporte</Link>
            <Link href="/privacidade" className="hover:text-white">Legal</Link>
          </div>
          <div className="h-[1px] bg-slate-800 w-20 mx-auto"></div>
          <p className="text-slate-600 font-bold text-xs uppercase tracking-widest italic">© 2026 Transporte BR - Logística Industrial Inteligente</p>
        </div>
      </footer>

    </div>
  );
}
