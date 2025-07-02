"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from '../../lib/supabase';
import { UserIcon, ChatBubbleLeftRightIcon, ClockIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { useState as useReactState } from 'react';

const WAVE_COLORS = ["#ab23ee", "#b7011e", "#6c2eb7", "#e14eca"];

function useWaveAnimation() {
  // Simple hook para animar ondas SVG
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setOffset((o) => (o + 1) % 100), 30);
    return () => clearInterval(id);
  }, []);
  return offset;
}

// Header visual para WaveLive
function WaveLiveHeader() {
  return (
    <div className="mb-10 flex flex-col items-center">
      <img src="/live_v2.png" alt="WaveLive Logo" className="w-[350px] h-[75px] mb-2 drop-shadow-lg ml-12" style={{objectFit:'contain'}} />
      <p className="text-lg text-gray-300 max-w-2xl text-center">
        Chats en tiempo real con tus clientes y agentes IA
      </p>
    </div>
  );
}

// Skeleton loader para chats
function ChatSkeleton() {
  return (
    <div className="bg-white/10 rounded-2xl p-4 shadow animate-pulse flex flex-col gap-2 min-h-[80px]">
      <div className="h-4 w-1/3 bg-white/20 rounded mb-2" />
      <div className="h-3 w-2/3 bg-white/10 rounded" />
      <div className="h-3 w-1/2 bg-white/10 rounded mt-1" />
    </div>
  );
}

export default function WaveLive() {
  const [agentes, setAgentes] = useState<string[]>([]);
  const [agente, setAgente] = useState<string>("");
  const [chats, setChats] = useState<any[]>([]); // activos
  const [historial, setHistorial] = useState<any[]>([]); // cerrados
  const [notificacion, setNotificacion] = useState<{numero:number, mensaje:string}|null>(null);
  const offset = useWaveAnimation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [loading, setLoading] = useReactState(false);

  // Cargar agentes únicos
  useEffect(() => {
    supabase.from("logs_agente_v2").select("agente_nombre").then(({ data }) => {
      const names = Array.from(new Set((data as any[] || []).map((d:any) => d.agente_nombre).filter(Boolean)));
      setAgentes(names);
      if (!agente && names.length) setAgente(names[0]);
    });
  }, []);

  // Cargar chats activos y cerrados para el agente seleccionado
  useEffect(() => {
    if (!agente) return;
    supabase.from("logs_agente_v2").select("*").then(({ data }) => {
      const logs = ((data as any[])||[]).filter((l:any) => l.agente_nombre === agente);
      // Agrupar por usuario_id y session_id
      const byChat = new Map<string, any[]>();
      logs.forEach((l:any) => {
        const key = l.session_id ? `${l.usuario_id}|${l.session_id}` : l.usuario_id;
        if (!byChat.has(key)) byChat.set(key, []);
        byChat.get(key)!.push(l);
      });
      const activos:any[] = [], cerrados:any[] = [];
      byChat.forEach((msgs, key) => {
        const tieneInicio = msgs.some((m:any) => m.evento === "inicio");
        const tieneFin = msgs.some((m:any) => m.evento === "fin");
        if (tieneInicio && !tieneFin) activos.push({ key, msgs });
        if (tieneInicio && tieneFin) cerrados.push({ key, msgs });
      });
      setChats(activos);
      setHistorial(cerrados);
    });
  }, [agente]);

  // Realtime: escuchar nuevos mensajes y actualizar chats
  useEffect(() => {
    const channel = supabase
      .channel("realtime:wavelive")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "logs_agente_v2" },
        (payload) => {
          if ((payload.new as any) && (payload.new as any).agente_nombre === agente) {
            // Si es un mensaje de inicio, notificar
            if ((payload.new as any).evento === "inicio") {
              setNotificacion({
                numero: (payload.new as any).usuario_id,
                mensaje: (payload.new as any).mensaje || "Nuevo chat iniciado"
              });
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
              }
            }
            // Refrescar chats
            supabase.from("logs_agente_v2").select("*").then(({ data }) => {
              const logs = ((data as any[])||[]).filter((l:any) => l.agente_nombre === agente);
              const byChat = new Map<string, any[]>();
              logs.forEach((l:any) => {
                const key = l.session_id ? `${l.usuario_id}|${l.session_id}` : l.usuario_id;
                if (!byChat.has(key)) byChat.set(key, []);
                byChat.get(key)!.push(l);
              });
              const activos:any[] = [], cerrados:any[] = [];
              byChat.forEach((msgs, key) => {
                const tieneInicio = msgs.some((m:any) => m.evento === "inicio");
                const tieneFin = msgs.some((m:any) => m.evento === "fin");
                if (tieneInicio && !tieneFin) activos.push({ key, msgs });
                if (tieneInicio && tieneFin) cerrados.push({ key, msgs });
              });
              setChats(activos);
              setHistorial(cerrados);
            });
          }
        }
      )
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [agente]);

  // Animación de notificación
  useEffect(() => {
    if (notificacion) {
      const t = setTimeout(() => setNotificacion(null), 3500);
      return () => clearTimeout(t);
    }
  }, [notificacion]);

  return (
    <div className="relative min-h-screen flex flex-col gap-2 px-0 md:px-8 pt-4 pb-8 bg-[#232327] overflow-hidden">
      {/* SVG animado de fondo: burbujas translúcidas */}
      <BubblesBackground />
      {/* Header visual WaveLive */}
      <WaveLiveHeader />
      {/* Selector de agente destacado, chips en una sola línea sin scroll-x */}
      <div className="sticky top-0 z-20 flex justify-center mb-4 pt-2 w-full">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl px-6 py-3 flex flex-col md:flex-row md:items-center w-full gap-2 md:gap-4">
          <div className="flex items-center gap-2 mb-1 md:mb-0">
            <UserIcon className="w-6 h-6 text-[#ab23ee]" />
            <span className="text-base md:text-lg font-bold text-white/90 tracking-wide whitespace-nowrap">Selecciona un agente</span>
          </div>
          <div className="flex-1 flex w-full">
            <div className="flex gap-2 flex-wrap justify-center w-full">
              {agentes.map(a => (
                <button
                  key={a}
                  onClick={() => setAgente(a)}
                  className={`flex items-center justify-center gap-2 px-6 py-2 rounded-full border-2 transition-all font-semibold text-base whitespace-nowrap shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ab23ee]/60 ${a === agente ? 'bg-gradient-to-tr from-[#ab23ee] to-[#b7011e] text-white border-[#ab23ee]/80 shadow-lg animate-pulse' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white/90'}`}
                  style={{ minWidth: '140px', maxWidth: '260px', transition: 'box-shadow 0.2s, background 0.2s' }}
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="truncate max-w-[110px] md:max-w-[150px]">{a}</span>
                  {a === agente && <span className="ml-3 px-2 py-0.5 rounded-full text-xs font-bold bg-[#ab23ee]/80 text-white animate-pulse">Activo</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Notificación de nuevo chat */}
      {notificacion && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-tr from-[#ab23ee] to-[#b7011e] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce-in">
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
          <span className="font-bold">Nuevo chat #{notificacion.numero}:</span>
          <span className="truncate max-w-[200px]">{notificacion.mensaje}</span>
        </div>
      )}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      {/* Layout principal: 2 columnas en desktop, 1 en mobile */}
      <div className="flex flex-col md:flex-row gap-8 z-10 w-full">
        <div className="flex-1">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-[#ab23ee]" />
              <h2 className="text-lg font-bold text-white/90">Chats activos</h2>
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-[#ab23ee]/20 text-[#ab23ee]">Realtime</span>
            </div>
            <div className="flex flex-col gap-3">
              {loading && Array.from({length: 2}).map((_,i) => <ChatSkeleton key={i} />)}
              {!loading && chats.length === 0 && <div className="text-white/40 text-center py-8">No hay chats activos</div>}
              {!loading && chats.map((chat, idx) => (
                <ChatCard key={chat.key} chat={chat} color={WAVE_COLORS[idx % WAVE_COLORS.length]} agente={agente} />
              ))}
            </div>
          </div>
        </div>
        {/* Historial */}
        <div className="w-full md:w-[340px]">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-2">
              <ClockIcon className="w-5 h-5 text-[#ab23ee]" />
              <h2 className="text-lg font-bold text-white/90">Historial</h2>
            </div>
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {historial.length === 0 && <div className="text-white/30 text-center py-6">Sin chats finalizados</div>}
              {historial.map((chat, idx) => (
                <ChatHistoryCard key={chat.key} chat={chat} color={WAVE_COLORS[idx % WAVE_COLORS.length]} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatCard({ chat, color, agente }: { chat: any, color: string, agente: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow flex flex-col gap-2 animate-fade-in transition-shadow duration-300 hover:shadow-[0_0_16px_2px_rgba(171,35,238,0.10)]">
      <div className="flex items-center gap-2 mb-1">
        <UserIcon className="w-5 h-5 text-white/70" />
        <span className="font-semibold text-white/90">{chat.msgs[0]?.usuario_nombre || chat.msgs[0]?.usuario_id}</span>
        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: color, color: '#fff' }}>#{chat.key.split('|')[0]}</span>
      </div>
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
        {chat.msgs.map((m: any, i: number) => (
          <div key={i} className="flex flex-col gap-1 animate-fade-in">
            {/* Mensaje usuario */}
            <div className="rounded-lg px-3 py-1.5 text-sm max-w-[80%] bg-[#ab23ee]/30 text-white/90 self-start rounded-bl-none animate-realtime-move">
              {m.mensaje}
              {/* Intención opcional: <span className='ml-2 text-xs text-white/60'>{m.intencion}</span> */}
            </div>
            {/* Respuesta agente */}
            {m.respuesta && (
              <div className="rounded-lg px-3 py-1.5 text-sm max-w-[80%] bg-blue-400/20 text-blue-100 self-end rounded-br-none animate-realtime-move">
                {m.respuesta}
                <span className="block text-xs text-blue-200/80 mt-1 font-medium">{agente}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
        <ClockIcon className="w-4 h-4" />
        Último mensaje: {new Date(chat.msgs[chat.msgs.length-1]?.timestamp).toLocaleString()}
      </div>
    </div>
  );
}

function ChatHistoryCard({ chat, color }: { chat: any, color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1 animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <CheckCircleIcon className="w-4 h-4 text-[#ab23ee]" />
        <span className="font-semibold text-white/80">{chat.msgs[0]?.usuario_nombre || chat.msgs[0]?.usuario_id}</span>
        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: color, color: '#fff' }}>#{chat.key.split('|')[0]}</span>
      </div>
      <div className="truncate text-xs text-white/50">
        {chat.msgs.find((m: any) => m.evento === 'inicio')?.mensaje}
      </div>
      <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
        <ClockIcon className="w-4 h-4" />
        Finalizado: {new Date(chat.msgs[chat.msgs.length-1]?.timestamp).toLocaleString()}
      </div>
    </div>
  );
}

function BubblesBackground() {
  return (
    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.13 }}>
      <g>
        <AnimatedBubble cx={200} cy={700} r={60} delay={0} color="#ab23ee" />
        <AnimatedBubble cx={600} cy={800} r={40} delay={1.2} color="#b7011e" />
        <AnimatedBubble cx={1200} cy={750} r={50} delay={2.1} color="#6c2eb7" />
        <AnimatedBubble cx={900} cy={850} r={30} delay={0.7} color="#e14eca" />
      </g>
    </svg>
  );
}

function AnimatedBubble({ cx, cy, r, delay, color }: { cx: number, cy: number, r: number, delay: number, color: string }) {
  // Usa CSS animation para mover la burbuja suavemente arriba y abajo
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={color}
      fillOpacity={0.18}
      style={{
        animation: `bubbleMove 7s ${delay}s ease-in-out infinite alternate`
      }}
      className="bubble-anim"
    />
  );
}

// Animaciones CSS
// Agrega en globals.css:
// .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.39,.575,.565,1) both; }
// .animate-bounce-in { animation: bounceIn 0.7s cubic-bezier(.39,.575,.565,1) both; }
// .animate-glow { animation: glow 2s ease-in-out infinite alternate; }
// .animate-pulse { animation: pulse 1.5s cubic-bezier(.4,0,.6,1) infinite; }
// .animate-realtime-glow { animation: realtimeGlow 2.2s ease-in-out infinite alternate; }
// .animate-realtime-move { animation: realtimeMove 1.2s ease-in-out infinite alternate; }
// @keyframes fadeIn { 0% { opacity: 0; transform: translateY(16px);} 100% { opacity: 1; transform: none; } }
// @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.8);} 60% { opacity: 1; transform: scale(1.05);} 100% { opacity: 1; transform: scale(1); } }
// @keyframes glow { 0% { text-shadow: 0 0 8px #ab23ee, 0 0 2px #fff; } 100% { text-shadow: 0 0 24px #b7011e, 0 0 8px #fff; } }
// @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .6; } }
// @keyframes realtimeGlow { 0% { box-shadow: 0 0 0px #ab23ee44; } 100% { box-shadow: 0 0 16px #ab23ee99; } }
// @keyframes realtimeMove { 0% { transform: translateY(0px); } 100% { transform: translateY(-2px) scale(1.01); } } 