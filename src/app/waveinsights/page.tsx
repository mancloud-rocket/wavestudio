'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { ChatBubbleLeftRightIcon, CheckCircleIcon, ClockIcon, UserIcon } from '@heroicons/react/24/solid';

const COLORS = ['#ab23ee', '#b7011e', '#6c2eb7', '#e14eca', '#fbbf24', '#10b981', '#6366f1'];

export default function WaveInsights() {
  const [kpi, setKpi] = useState<any>({});
  const [volumenAgente, setVolumenAgente] = useState<any[]>([]);
  const [intents, setIntents] = useState<any[]>([]);
  const [porHora, setPorHora] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any>({ podio: [], resto: [] });

  // Función para cargar todos los datos agregados
  const fetchData = useCallback(async () => {
    // Volumen total
    const { count: total } = await supabase
      .from('logs_agente_v2')
      .select('*', { count: 'exact', head: true });

    // Todos los logs para analítica agregada
    const { data: logs } = await supabase
      .from('logs_agente_v2')
      .select('*');

    const logsArr = logs ?? [];
    // Agrupación de chats por usuario y session_id (o por usuario y secuencia de inicio/fin)
    type Log = { usuario_id: string, usuario_nombre?: string, session_id?: string, evento: string, timestamp: string, agente_nombre?: string, canal?: string, intencion?: string };
    type Chat = { key: string, msgs: Log[] };
    let chats: Chat[] = [];
    let abiertos = 0;
    if (logsArr.length > 0) {
      // Agrupamos por usuario_id y session_id si existe, si no, por usuario_id y secuencia
      const byUser = new Map<string, Log[]>();
      logsArr.forEach((l: Log) => {
        const key = l.session_id ? `${l.usuario_id}|${l.session_id}` : l.usuario_id;
        if (!byUser.has(key)) byUser.set(key, []);
        byUser.get(key)!.push(l);
      });
      byUser.forEach((msgs: Log[], key: string) => {
        // Un chat es válido si tiene al menos un evento 'inicio' y uno 'fin'
        const tieneInicio = msgs.some((m: Log) => m.evento === 'inicio');
        const tieneFin = msgs.some((m: Log) => m.evento === 'fin');
        if (tieneInicio && tieneFin) chats.push({ key, msgs });
        if (tieneInicio && !tieneFin) abiertos++;
      });
    }

    // KPIs
    const usuariosSet = new Set(logsArr.map((l: Log) => l.usuario_id));
    // Duración promedio por chat resuelto
    const duraciones = chats.map((chat: Chat) => {
      const inicios = chat.msgs.filter((l: Log) => l.evento === 'inicio');
      const fines = chat.msgs.filter((l: Log) => l.evento === 'fin');
      if (inicios.length === 0 || fines.length === 0) return 0;
      const inicio = Math.min(...inicios.map((l: Log) => new Date(l.timestamp).getTime()));
      const fin = Math.max(...fines.map((l: Log) => new Date(l.timestamp).getTime()));
      return (fin - inicio) / 60000;
    }).filter((d: number) => d > 0);
    // Volumen por agente (sumar todos los canales)
    const agentesMap = new Map<string, number>();
    logsArr.forEach((l: Log) => {
      if (!l.agente_nombre) return;
      agentesMap.set(l.agente_nombre, (agentesMap.get(l.agente_nombre) || 0) + 1);
    });
    const agentes = Array.from(agentesMap.entries()).map(([agente_nombre, count]) => ({ agente_nombre, count }));
    // Intenciones más frecuentes
    const intentsMap = new Map<string, number>();
    logsArr.filter((l: Log) => l.intencion).forEach((l: Log) => {
      intentsMap.set(l.intencion!, (intentsMap.get(l.intencion!) || 0) + 1);
    });
    const intentsData = Array.from(intentsMap.entries()).map(([intencion, count]) => ({ intencion, count }));
    // Mensajes por hora (agrupados por día/hora)
    const horasMap = new Map<string, number>();
    logsArr.forEach((l: Log) => {
      const date = new Date(l.timestamp);
      const key = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:00`;
      horasMap.set(key, (horasMap.get(key) || 0) + 1);
    });
    const horas = Array.from(horasMap.entries()).map(([hora, mensajes]) => ({ hora, mensajes })).sort((a, b) => a.hora.localeCompare(b.hora));
    // Top usuarios
    const usersMap = new Map<string, number>();
    logsArr.forEach((l: Log) => {
      const key = l.usuario_id + '|' + (l.usuario_nombre || '');
      usersMap.set(key, (usersMap.get(key) || 0) + 1);
    });
    const users = Array.from(usersMap.entries()).map(([k, count]) => {
      const [usuario_id, usuario_nombre] = k.split('|');
      return { usuario_id, usuario_nombre, count };
    }).sort((a, b) => b.count - a.count);
    const podio = users.slice(0, 3);
    const resto = users.slice(3, 10);

    setKpi({
      total: total ?? 0,
      resueltos: chats.length,
      abiertos,
      usuarios: usuariosSet.size,
      duracion: duraciones.length > 0 ? Math.round(duraciones.reduce((a, b) => a + b, 0) / duraciones.length) : 0,
    });
    setVolumenAgente(agentes);
    setIntents(intentsData);
    setPorHora(horas);
    setTopUsers({ podio, resto });
  }, []);

  // Realtime: suscribirse a cambios en la tabla
  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('realtime:logs_agente_v2')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'logs_agente_v2' }, fetchData)
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [fetchData]);

  return (
    <section className="flex flex-col gap-8">
      {/* Header analítica */}
      <div className="relative flex flex-col items-center justify-center py-2 mb-2 bg-gradient-to-tr from-[#1a1420] via-[#2d1a3a] to-[#ab23ee]/30 rounded-2xl shadow-lg">
        <img src="/logo_v2.png" alt="WaveStudio Logo" className="w-12 h-12 mb-1 drop-shadow-lg" />
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-[#ab23ee] to-[#b7011e] mb-0.5">WaveInsights</h1>
        <p className="text-sm text-white/80 font-medium">Analítica avanzada de tus agentes IA en tiempo real</p>
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <KpiCard label="Mensajes" value={kpi.total} icon={<ChatBubbleLeftRightIcon className="w-7 h-7 text-white" />} />
        <KpiCard label="Chats resueltos" value={kpi.resueltos} icon={<CheckCircleIcon className="w-7 h-7 text-white" />} />
        <KpiCard label="Chats abiertos" value={kpi.abiertos} icon={<ClockIcon className="w-7 h-7 text-white" />} />
        <KpiCard label="Usuarios" value={kpi.usuarios} icon={<UserIcon className="w-7 h-7 text-white" />} />
        <KpiCard label="Duración prom. (min)" value={kpi.duracion} icon={<ClockIcon className="w-7 h-7 text-white" />} />
      </div>
      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#1a1420]/80 rounded-xl p-6 shadow-md">
          <h2 className="font-bold mb-2 text-[#ab23ee]">Volumen por Agente</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={volumenAgente}>
              <XAxis dataKey="agente_nombre" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ab23ee" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#1a1420]/80 rounded-xl p-6 shadow-md flex flex-col gap-4">
          <h2 className="font-bold mb-2 text-[#ab23ee]">Intenciones más frecuentes</h2>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/2">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={intents} dataKey="count" nameKey="intencion" cx="50%" cy="50%" outerRadius={70}>
                    {intents.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Tabla top 3 intenciones */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <table className="w-full text-sm text-left bg-[#2d1a3a]/60 rounded-lg">
                <thead>
                  <tr>
                    <th className="py-1 px-2 text-[#ab23ee]">Intención</th>
                    <th className="py-1 px-2 text-[#ab23ee]">Incidencia</th>
                  </tr>
                </thead>
                <tbody>
                  {intents.slice(0, 3).map((i: any, idx: number) => (
                    <tr key={idx} className="border-b border-[#ab23ee]/10">
                      <td className="py-1 px-2 text-white/90">{i.intencion}</td>
                      <td className="py-1 px-2 text-[#ab23ee] font-bold">{i.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1420]/80 rounded-xl p-6 shadow-md">
          <h2 className="font-bold mb-2 text-[#ab23ee]">Mensajes por Hora</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={porHora}>
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="mensajes" stroke="#ab23ee" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#1a1420]/80 rounded-xl p-6 shadow-md flex flex-col gap-4">
          <h2 className="font-bold mb-2 text-[#ab23ee]">Usuarios más activos</h2>
          {/* Podio */}
          <div className="flex justify-center gap-4 mb-2">
            {topUsers.podio && topUsers.podio.map((u: any, i: number) => (
              <div key={i} className={`flex flex-col items-center ${i === 0 ? 'scale-110' : i === 2 ? 'scale-90' : ''}`}>
                <div className={`rounded-full bg-gradient-to-tr from-[#ab23ee] to-[#b7011e] w-14 h-14 flex items-center justify-center text-xl font-bold text-white mb-1 border-4 border-[#1a1420]`}>{i + 1}</div>
                <span className="font-bold text-white text-sm">{u.usuario_nombre || u.usuario_id}</span>
                <span className="text-[#ab23ee] font-bold">{u.count}</span>
              </div>
            ))}
          </div>
          {/* Tabla resto */}
          <table className="w-full text-sm text-left">
            <tbody>
              {topUsers.resto && topUsers.resto.map((u: any, i: number) => (
                <tr key={i} className="border-b border-[#ab23ee]/10">
                  <td className="py-1 px-2 text-white/90">{u.usuario_nombre || u.usuario_id}</td>
                  <td className="py-1 px-2 text-[#ab23ee] font-bold">{u.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function KpiCard({ label, value, icon }: { label: string, value: any, icon: React.ReactNode }) {
  return (
    <div
      className="relative group bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-4 shadow transition-all duration-200 hover:shadow-2xl hover:border-[#ab23ee]/60 hover:bg-white/20 cursor-pointer min-h-[64px]"
      style={{ minWidth: 0 }}
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-200 group-hover:-translate-y-0.5">
        {icon}
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <span className="uppercase text-[11px] md:text-xs font-semibold text-white/70 group-hover:text-white/90 tracking-widest mb-0.5 whitespace-nowrap transition-colors duration-200">
          {label}
        </span>
        <span className="text-2xl md:text-3xl font-semibold text-white group-hover:text-white/95 leading-tight truncate transition-colors duration-200" style={{fontVariantNumeric: 'tabular-nums'}}>
          {value}
        </span>
      </div>
    </div>
  );
} 