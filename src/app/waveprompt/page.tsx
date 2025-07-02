"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PlusIcon, UserIcon, ExclamationTriangleIcon, SparklesIcon } from '@heroicons/react/24/solid';

const AGENT_EXCEPTIONS = [
  { key: 'onError', label: '¿Qué hacer en caso de error?' },
  { key: 'onIntentNotDetected', label: '¿Qué hacer si no se detecta intención?' },
  // Puedes agregar más excepciones aquí
];

type Prompt = {
  id: number;
  titulo: string;
  descripcion: string;
  texto: string;
  agente: string;
  rol: string;
  tono: string;
  ubicacion: string;
  idiomas: string[];
  excepciones: Record<string, string>;
};

function WavePromptHeader() {
  return (
    <div className="relative flex flex-col items-center justify-center py-4 mb-2 bg-gradient-to-tr from-[#1a1420] via-[#2d1a3a] to-[#ab23ee]/30 rounded-2xl shadow-lg w-full">
      <img src="/logo_v2.png" alt="WaveStudio Logo" className="w-12 h-12 mb-1 drop-shadow-lg animate-pulse" />
      <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-[#ab23ee] to-[#b7011e] mb-0.5 tracking-tight">WavePrompt</h1>
      <p className="text-sm text-white/80 font-medium">Gestiona el prompt master y directrices de tus agentes IA</p>
    </div>
  );
}

export default function WavePrompt() {
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  // Placeholder para prompts y agentes
  const prompts = [
    {
      id: 1,
      titulo: 'Prompt Master - Agente Bancario',
      descripcion: 'Prompt principal que define el contexto, rol, tono y directrices para el agente bancario.',
      texto: 'Eres un asistente virtual bancario profesional, cordial y claro. Tu objetivo es ayudar a los usuarios con consultas financieras, siempre manteniendo confidencialidad y precisión. Adapta tu lenguaje a la región de España y responde en español neutro. Si el usuario solicita información sensible, verifica su identidad antes de continuar.',
      agente: 'Agente Bancario',
      rol: 'Asistente Bancario',
      tono: 'Profesional y cordial',
      ubicacion: 'España',
      idiomas: ['Español'],
      excepciones: {
        onError: 'Responde: "Ha ocurrido un error inesperado. Por favor, intenta nuevamente o contacta soporte."',
        onIntentNotDetected: 'Responde: "No he entendido tu solicitud. ¿Podrías reformularla o darme más detalles?"',
      },
    },
    {
      id: 2,
      titulo: 'Prompt Master - Soporte Técnico Global',
      descripcion: 'Prompt master para el agente de soporte técnico global, adaptable a múltiples idiomas y regiones.',
      texto: 'Eres un agente de soporte técnico global, amigable y resolutivo. Tu misión es guiar a los usuarios para resolver problemas técnicos, adaptando tu respuesta al idioma y región del usuario. Usa ejemplos claros y evita tecnicismos innecesarios. Si no sabes la respuesta, ofrece escalar el caso.',
      agente: 'Agente Soporte Global',
      rol: 'Soporte Técnico',
      tono: 'Amigable y paciente',
      ubicacion: 'Global',
      idiomas: ['Español', 'Inglés', 'Portugués'],
      excepciones: {
        onError: 'Responde: "Ha ocurrido un inconveniente técnico. Por favor, intenta más tarde o contacta a nuestro equipo."',
        onIntentNotDetected: 'Responde: "No logré identificar tu problema. ¿Puedes explicarlo de otra manera?"',
      },
    },
  ];
  const agentes = ['Agente 1', 'Agente 2'];
  const idiomasDisponibles = ['Español', 'Inglés', 'Portugués', 'Francés', 'Alemán'];

  return (
    <section className="flex flex-col items-center justify-center h-full w-full gap-8">
      <WavePromptHeader />
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Header y botón crear */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-white/90">Prompts</h2>
          <button
            className="flex items-center gap-2 bg-gradient-to-tr from-[#ab23ee] to-[#b7011e] text-white font-bold px-5 py-2 rounded-full shadow-lg hover:scale-[1.03] transition-all"
            onClick={() => setShowPromptForm(true)}
          >
            <PlusIcon className="w-5 h-5" /> Nuevo prompt
          </button>
        </div>
        {/* Listado de prompts (placeholder) */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-6 min-h-[120px] flex flex-col gap-4">
          {prompts.length === 0 ? (
            <span className="text-gray-400 text-center">Aún no hay prompts creados.</span>
          ) : (
            prompts.map((prompt) => (
              <button
                key={prompt.id}
                className="bg-white/5 rounded-xl p-4 border border-white/10 shadow flex flex-col gap-2 text-left hover:bg-white/10 transition cursor-pointer focus:outline-none"
                onClick={() => setSelectedPrompt(prompt)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <UserIcon className="w-5 h-5 text-[#ab23ee]" />
                  <span className="font-bold text-white/90 text-lg truncate">{prompt.titulo}</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-[#ab23ee]/80 text-white">Prompt Master</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-[#ab23ee]/20 text-[#ab23ee]">{prompt.agente}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-xs">Rol: <span className="font-semibold">{prompt.rol}</span></span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-xs">Tono: <span className="font-semibold">{prompt.tono}</span></span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-xs">Ubicación: <span className="font-semibold">{prompt.ubicacion}</span></span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-xs">Idiomas: <span className="font-semibold">{prompt.idiomas.join(', ')}</span></span>
                </div>
                <div className="text-gray-300 text-sm mb-1 truncate">{prompt.descripcion}</div>
                <div className="text-white/80 font-mono text-xs bg-white/10 rounded p-2 mb-1 truncate">{prompt.texto}</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Object.entries(prompt.excepciones).map(([key, val]) => (
                    <span key={key} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-200 text-xs"><ExclamationTriangleIcon className="w-4 h-4" /> {val}</span>
                  ))}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      {/* Modal/Formulario para crear prompt */}
      {showPromptForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#232327] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-2xl flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setShowPromptForm(false)}>&times;</button>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
              <SparklesIcon className="w-6 h-6 text-[#ab23ee]" /> Crear nuevo prompt
            </h3>
            {/* Asistente IA para crear prompt */}
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3 mb-2">
              <SparklesIcon className="w-5 h-5 text-[#ab23ee]" />
              <span className="text-sm text-white/80">¿Quieres ayuda de IA para redactar tu prompt?</span>
              <button className="ml-auto bg-gradient-to-tr from-[#ab23ee] to-[#b7011e] text-white px-3 py-1 rounded-full text-xs font-bold shadow hover:scale-105 transition">Generar con IA</button>
            </div>
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-white/80 font-semibold mb-1">Título</label>
                <input className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ab23ee]/40" placeholder="Título del prompt master" />
              </div>
              <div>
                <label className="block text-white/80 font-semibold mb-1">Descripción</label>
                <textarea className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ab23ee]/40" placeholder="Describe el propósito del prompt master" rows={2} />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-white/80 font-semibold mb-1">Rol del agente</label>
                  <input className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ab23ee]/40" placeholder="Ej: Asistente Bancario" />
                </div>
                <div className="flex-1">
                  <label className="block text-white/80 font-semibold mb-1">Tono</label>
                  <input className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ab23ee]/40" placeholder="Ej: Formal y cordial" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-white/80 font-semibold mb-1">Ubicación geográfica</label>
                  <input className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ab23ee]/40" placeholder="Ej: España, Global, México..." />
                </div>
                <div className="flex-1">
                  <label className="block text-white/80 font-semibold mb-1">Idiomas</label>
                  <select multiple className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ab23ee]/40">
                    {idiomasDisponibles.map(idioma => <option key={idioma} value={idioma}>{idioma}</option>)}
                  </select>
                  <span className="text-xs text-gray-400">Mantén Ctrl/Cmd para seleccionar varios</span>
                </div>
              </div>
              <div>
                <label className="block text-white/80 font-semibold mb-1">Texto del prompt master</label>
                <textarea className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/10 text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#ab23ee]/40" placeholder="Define aquí el contexto, rol, tono, idioma, ubicación, etc. para el agente..." rows={4} />
              </div>
              <div>
                <label className="block text-white/80 font-semibold mb-1">Agente vinculado</label>
                <select className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ab23ee]/40">
                  <option value="">Selecciona un agente</option>
                  {agentes.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              {/* Excepciones configurables */}
              <div className="flex flex-col gap-2">
                <span className="text-white/80 font-semibold mb-1 flex items-center gap-1"><ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" /> Excepciones</span>
                {AGENT_EXCEPTIONS.map(ex => (
                  <div key={ex.key} className="flex flex-col gap-1">
                    <label className="text-sm text-white/70">{ex.label}</label>
                    <input className="w-full rounded-lg px-3 py-1 bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ab23ee]/40" placeholder="Acción o mensaje personalizado..." />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition" onClick={() => setShowPromptForm(false)}>Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-gradient-to-tr from-[#ab23ee] to-[#b7011e] text-white font-bold shadow hover:scale-105 transition">Guardar prompt master</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal de detalle del prompt */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#232327] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-2xl flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setSelectedPrompt(null)}>&times;</button>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
              <UserIcon className="w-7 h-7 text-[#ab23ee]" /> {selectedPrompt.titulo}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-[#ab23ee]/80 text-white">Prompt Master</span>
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-xs">Agente: <span className="font-semibold">{selectedPrompt.agente}</span></span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-xs">Rol: <span className="font-semibold">{selectedPrompt.rol}</span></span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-xs">Tono: <span className="font-semibold">{selectedPrompt.tono}</span></span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-xs">Ubicación: <span className="font-semibold">{selectedPrompt.ubicacion}</span></span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-xs">Idiomas: <span className="font-semibold">{selectedPrompt.idiomas.join(', ')}</span></span>
            </div>
            <div className="text-gray-300 text-base mb-2">{selectedPrompt.descripcion}</div>
            <div>
              <label className="block text-white/80 font-semibold mb-1">Texto completo del prompt master</label>
              <div className="text-white/90 font-mono text-sm bg-white/10 rounded p-4 whitespace-pre-line">
                {selectedPrompt.texto}
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-white/80 font-semibold mb-1 flex items-center gap-1"><ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" /> Excepciones configuradas</span>
              {Object.entries(selectedPrompt.excepciones).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-200 text-xs"><ExclamationTriangleIcon className="w-4 h-4" /> {val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 