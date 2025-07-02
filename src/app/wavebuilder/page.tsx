"use client";
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { RocketLaunchIcon, BuildingOffice2Icon, UsersIcon, ServerStackIcon, DevicePhoneMobileIcon, InformationCircleIcon, SparklesIcon, SunIcon, MoonIcon, GlobeAltIcon } from '@heroicons/react/24/solid';

const etapas = [
  {
    key: 'empresa',
    pregunta: '¿A qué se dedica tu empresa?',
    icon: <GlobeAltIcon className="w-10 h-10 text-blue-400 animate-spin-slow" />,
    placeholder: 'Ej: Tecnología, Retail, Salud...'
  },
  {
    key: 'departamento',
    pregunta: '¿Para qué departamento trabajará el agente?',
    icon: <BuildingOffice2Icon className="w-10 h-10 text-purple-400 animate-bounce" />,
    placeholder: 'Ej: Soporte, Ventas, RRHH...'
  },
  {
    key: 'publico',
    pregunta: '¿Quién es el público objetivo del agente?',
    icon: <UsersIcon className="w-10 h-10 text-pink-400 animate-pulse" />,
    placeholder: 'Ej: Clientes, empleados, proveedores...'
  },
  {
    key: 'origenes',
    pregunta: '¿Cuáles son los orígenes de datos del agente?',
    icon: <ServerStackIcon className="w-10 h-10 text-yellow-400 animate-float" />,
    opciones: ['Supabase', 'SQL Server', 'HTTP API', 'Otros'],
  },
  {
    key: 'canal',
    pregunta: '¿En qué canal operará el agente?',
    icon: <DevicePhoneMobileIcon className="w-10 h-10 text-green-400 animate-wiggle" />,
    placeholder: 'Ej: WhatsApp, Web, Slack...'
  },
  {
    key: 'detalle',
    pregunta: '¿Algún detalle especial que deba saber sobre tu agente?',
    icon: <InformationCircleIcon className="w-10 h-10 text-cyan-400 animate-spin-reverse" />,
    placeholder: 'Ej: Debe responder en inglés, tiene restricciones legales, etc.'
  },
  {
    key: 'cargando',
    pregunta: '¡Construyendo tu agente en la galaxia Wave...!',
    icon: <RocketLaunchIcon className="w-12 h-12 text-[#ab23ee] animate-bounce" />,
    loading: true
  },
  {
    key: 'final',
    pregunta: '¡Aquí tienes tu agente!',
    icon: <SparklesIcon className="w-12 h-12 text-yellow-300 animate-twinkle" />,
    final: true
  }
];

// Animaciones personalizadas
const animaciones = [
  'animate-fade-in',
  'animate-slide-in-right',
  'animate-slide-in-left',
  'animate-fade-in',
  'animate-slide-in-up',
  'animate-slide-in-down',
];

export default function WaveBuilder() {
  const [etapa, setEtapa] = useState(0);
  const [respuestas, setRespuestas] = useState<any>({});
  const [anim, setAnim] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [mensajeFinal, setMensajeFinal] = useState('');
  const [mensajesCompletados, setMensajesCompletados] = useState(false);

  // Forzar fondo transparente solo cuando WaveBuilder está montado
  useEffect(() => {
    const main = document.querySelector('main');
    if (main) main.style.background = 'transparent';
    return () => { if (main) main.style.background = ''; };
  }, []);

  // Limpiar input al avanzar de etapa
  const handleNext = (key: string, value: any) => {
    setRespuestas((r: any) => ({ ...r, [key]: value }));
    setInputValue('');
    setAnim((a) => (a + 1) % animaciones.length);
    setTimeout(() => setEtapa((e) => e + 1), 350);
  };

  const etapaActual = etapas[etapa];
  // Lista de planetas-resumen
  const planetas = Object.entries(respuestas).map(([key, value], idx) => (
    <PlanetaResumen key={key} idx={idx} nombre={key} valor={String(value)} />
  ));

  // Auto-avanzar loading screen después de 10 segundos
  useEffect(() => {
    if (etapa === 6) {
      const timer = setTimeout(() => {
        setEtapa(7);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [etapa]);

  // Secuencia de mensajes finales
  useEffect(() => {
    if (etapa === 7) {
      setMensajesCompletados(false);
      const mensajes = [
        { texto: 'Listo.', duracion: 1500 },
        { texto: 'Lo tenemos!', duracion: 1500 },
        { texto: 'Bienvenido al universo Wave by Rocketbot!', duracion: 3000 }
      ];
      
      let index = 0;
      const mostrarMensaje = () => {
        if (index < mensajes.length) {
          setMensajeFinal(mensajes[index].texto);
          setTimeout(() => {
            setMensajeFinal('');
            index++;
            if (index < mensajes.length) {
              setTimeout(mostrarMensaje, 500);
            } else {
              // Todos los mensajes han sido mostrados
              setTimeout(() => {
                setMensajesCompletados(true);
              }, 500);
            }
          }, mensajes[index].duracion);
        }
      };
      
      setTimeout(mostrarMensaje, 1000);
    }
  }, [etapa]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-2 wavebuilder-bg">
      {/* Fondo espacial solo para WaveBuilder */}
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
        <GalacticCinematicBackground />
      </div>
      {etapa === 7 ? (
        // Pantalla limpia solo para mensajes finales
        <div className="relative z-10 w-full h-screen flex items-start justify-center pt-32 animate-cinematic-in">
          {mensajeFinal ? (
            <div className="text-center animate-fade-in">
              <h1 className={`text-4xl md:text-6xl font-extrabold text-white ${mensajeFinal.includes('Bienvenido') ? 'text-transparent bg-clip-text bg-gradient-to-tr from-[#ab23ee] to-[#b7011e]' : ''} tracking-tight drop-shadow-lg`}>
                {mensajeFinal}
              </h1>
            </div>
          ) : mensajesCompletados ? (
            <div className="text-center animate-fade-in">
              <SparklesIcon className="w-16 h-16 text-yellow-300 animate-twinkle mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg mb-6">¡Aquí tienes tu agente!</h1>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl max-w-2xl mx-auto">
                <div className="text-white/90 font-mono text-lg whitespace-pre-line">
                  Aquí va el agente de Saturn
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        // Contenido normal para las otras etapas
        <div className={`relative z-10 w-full max-w-xl mx-auto flex flex-col items-center justify-center py-10 gap-8 animate-cinematic-in ${animaciones[anim]}`}>
          {/* Planetas resumen */}
          {planetas.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center mb-2 w-full animate-fade-in">
              {planetas}
            </div>
          )}
          {/* Header */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <img src="/builder.png" alt="WaveBuilder Logo" className="max-w-xs w-auto h-16 mb-1" style={{objectFit:'contain'}} />
            {etapaActual.icon}
            <p className="text-base text-white/80 font-medium">Crea tu agente digital paso a paso, ¡en el universo Rocketbot!</p>
          </div>
          {/* Pregunta principal */}
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 min-h-[180px]">
            <h2 className="text-xl md:text-2xl font-bold text-white text-center flex items-center gap-2 animate-fade-in">
              {etapaActual.pregunta}
            </h2>
            {/* Inputs dinámicos */}
            {etapa <= 2 && (
              <input
                className="w-full max-w-md rounded-lg px-5 py-3 bg-white/10 border border-white/10 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#ab23ee]/40 transition"
                placeholder={etapaActual.placeholder}
                autoFocus
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && inputValue) handleNext(etapaActual.key, inputValue); }}
              />
            )}
            {etapa === 3 && (
              <div className="flex flex-wrap gap-4 justify-center">
                {etapaActual.opciones?.map((op: string) => (
                  <button
                    key={op}
                    className={`px-6 py-3 rounded-full border-2 border-white/20 bg-white/10 text-white font-semibold text-lg shadow hover:bg-[#ab23ee]/30 hover:border-[#ab23ee] transition-all animate-float`}
                    onClick={() => handleNext(etapaActual.key, op)}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}
            {etapa === 4 && (
              <input
                className="w-full max-w-md rounded-lg px-5 py-3 bg-white/10 border border-white/10 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#ab23ee]/40 transition"
                placeholder={etapaActual.placeholder}
                autoFocus
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && inputValue) handleNext(etapaActual.key, inputValue); }}
              />
            )}
            {etapa === 5 && (
              <textarea
                className="w-full max-w-md rounded-lg px-5 py-3 bg-white/10 border border-white/10 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#ab23ee]/40 transition"
                placeholder={etapaActual.placeholder}
                rows={3}
                autoFocus
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && inputValue) { e.preventDefault(); handleNext(etapaActual.key, inputValue); } }}
              />
            )}
            {etapa === 6 && (
              <div className="flex flex-col items-center gap-4 w-full animate-fade-in">
                <div className="flex items-center gap-3">
                  <RocketLaunchIcon className="w-10 h-10 text-[#ab23ee] animate-bounce" />
                  <span className="text-white/80 text-lg font-semibold">Construyendo tu agente en la galaxia Wave...</span>
                  <SunIcon className="w-8 h-8 text-yellow-300 animate-spin-slow" />
                  <MoonIcon className="w-7 h-7 text-blue-200 animate-float" />
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-[#ab23ee] via-[#b7011e] to-[#ab23ee] animate-progress-bar" style={{ width: '100%' }} />
                </div>
              </div>
            )}
          </div>
          {/* Botón siguiente para etapas con input manual */}
          {etapa <= 2 && (
            <button
              className="mt-2 px-8 py-3 rounded-full bg-gradient-to-tr from-[#ab23ee] to-[#b7011e] text-white font-bold shadow-lg hover:scale-105 transition-all animate-fade-in"
              onClick={() => {
                if (inputValue) handleNext(etapaActual.key, inputValue);
              }}
            >
              Siguiente
            </button>
          )}
          {etapa === 4 && (
            <button
              className="mt-2 px-8 py-3 rounded-full bg-gradient-to-tr from-[#ab23ee] to-[#b7011e] text-white font-bold shadow-lg hover:scale-105 transition-all animate-fade-in"
              onClick={() => {
                if (inputValue) handleNext(etapaActual.key, inputValue);
              }}
            >
              Siguiente
            </button>
          )}
          {etapa === 5 && (
            <button
              className="mt-2 px-8 py-3 rounded-full bg-gradient-to-tr from-[#ab23ee] to-[#b7011e] text-white font-bold shadow-lg hover:scale-105 transition-all animate-fade-in"
              onClick={() => {
                if (inputValue) handleNext(etapaActual.key, inputValue);
              }}
            >
              Siguiente
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Fondo espacial cinemático y avanzado
function GalacticCinematicBackground() {
  // Generar posiciones fijas para las estrellas usando useMemo
  const estrellas = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3
    }));
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Nebulosa principal */}
      <div className="absolute left-10 top-10 w-44 h-44 bg-gradient-to-tr from-[#ab23ee] to-[#b7011e] rounded-full blur-3xl opacity-40 animate-float" />
      {/* Planeta grande */}
      <div className="absolute right-16 top-32 w-32 h-32 bg-gradient-to-tr from-blue-400 to-purple-600 rounded-full blur-2xl opacity-50 animate-float-reverse shadow-2xl" />
      {/* Sol */}
      <div className="absolute left-1/2 bottom-10 w-52 h-52 bg-gradient-to-tr from-yellow-200 to-pink-400 rounded-full blur-3xl opacity-30 animate-spin-slow shadow-xl" />
      {/* Luna */}
      <div className="absolute right-1/3 top-1/4 w-20 h-20 bg-gradient-to-tr from-white to-blue-200 rounded-full blur-lg opacity-40 animate-twinkle" />
      {/* Planeta con anillos */}
      <div className="absolute left-1/4 bottom-1/3 w-28 h-28 bg-gradient-to-tr from-[#b7011e] to-[#ab23ee] rounded-full blur-2xl opacity-40 animate-float" />
      <div className="absolute left-[28%] bottom-[38%] w-36 h-8 bg-gradient-to-r from-[#ab23ee]/60 to-[#b7011e]/30 rounded-full blur-md opacity-30 animate-spin-slow" style={{ transform: 'rotate(-20deg)' }} />
      {/* Estrellas */}
      {estrellas.map((estrella) => (
        <div key={estrella.id} className={`absolute bg-white rounded-full opacity-70 animate-twinkle`} style={{
          width: `${estrella.width}px`,
          height: `${estrella.height}px`,
          left: `${estrella.left}%`,
          top: `${estrella.top}%`,
          animationDelay: `${estrella.delay}s`
        }} />
      ))}
      {/* Cometa */}
      <div className="absolute left-1/3 top-1/5 w-32 h-2 bg-gradient-to-r from-white via-blue-200 to-transparent rounded-full blur-md opacity-60 animate-slide-in-right" style={{ animationDuration: '4s', animationIterationCount: 'infinite' }} />
      {/* Galaxia espiral */}
      <div className="absolute right-1/4 bottom-1/4 w-40 h-40 bg-gradient-to-tr from-[#ab23ee]/60 to-[#b7011e]/30 rounded-full blur-3xl opacity-30 animate-spin-slow" style={{ filter: 'blur(24px)' }} />
    </div>
  );
}

// Componente de planeta resumen animado
function PlanetaResumen({ idx, nombre, valor }: { idx: number, nombre: string, valor: string }) {
  // Colores y tamaños variados para cada planeta
  const planetas = [
    'from-[#ab23ee] to-[#b7011e]',
    'from-blue-400 to-purple-600',
    'from-yellow-200 to-pink-400',
    'from-white to-blue-200',
    'from-[#b7011e] to-[#ab23ee]',
    'from-green-300 to-blue-400',
    'from-pink-400 to-yellow-200',
  ];
  const size = 48 + idx * 8;
  return (
    <div className={`relative flex flex-col items-center animate-float`} style={{ animationDelay: `${idx * 0.2}s` }}>
      <div className={`w-[${size}px] h-[${size}px] bg-gradient-to-tr ${planetas[idx % planetas.length]} rounded-full shadow-xl border-2 border-white/20 flex items-center justify-center mb-1`}>
        <span className="text-white/90 font-bold text-xs md:text-sm px-2 py-1 whitespace-nowrap drop-shadow-lg">{nombre}</span>
      </div>
      <span className="text-white/80 text-xs text-center max-w-[90px] truncate">{valor}</span>
    </div>
  );
}

// Animaciones Tailwind personalizadas (agregar en tailwind.config.js):
// animate-fade-in, animate-slide-in-right, animate-slide-in-left, animate-slide-in-up, animate-slide-in-down, animate-float, animate-float-reverse, animate-spin-slow, animate-twinkle, animate-wiggle, animate-progress-bar

// Ejemplo de cómo consultar logs_agente:
// useEffect(() => {
//   supabase.from('logs_agente').select('*').then(console.log);
// }, []); 