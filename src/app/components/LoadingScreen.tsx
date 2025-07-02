"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onFinish();
    }, 7000);

    // Animación de progreso suave
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 8 + 2;
      });
    }, 100);

    // Cambios de fase
    const phaseInterval = setInterval(() => {
      setPhase(prev => (prev + 1) % 4);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, [onFinish]);

  if (!show) return null;

  const loadingMessages = [
    "Inicializando WaveStudio...",
    "Cargando módulos...",
    "Preparando interfaz...",
    "¡Listo para crear!"
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] overflow-hidden">
      {/* Fondo con gradientes suaves */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#ab23ee]/10 via-transparent to-[#b7011e]/10 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#b7011e]/5 via-transparent to-[#ab23ee]/5 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Partículas flotantes suaves */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-[#ab23ee] to-[#b7011e] rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Logo principal con efectos suaves */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Halo de energía suave */}
        <div className="absolute inset-0 w-[600px] h-[600px] bg-gradient-to-r from-[#ab23ee]/20 to-[#b7011e]/20 rounded-full blur-3xl animate-pulse" />
        
        {/* Logo con animación suave */}
        <div className="relative transform transition-all duration-1000 hover:scale-105">
          <Image 
            src="/logo_v2.png" 
            alt="WaveStudio Logo" 
            width={550} 
            height={550} 
            className="drop-shadow-2xl animate-pulse"
            style={{ animationDuration: '3s' }}
          />
        </div>

        {/* Anillos concéntricos animados */}
        <div className="absolute inset-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute border-2 border-[#ab23ee]/30 rounded-full animate-ping"
              style={{
                left: '50%',
                top: '50%',
                width: `${350 + i * 80}px`,
                height: `${350 + i * 80}px`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Mensaje de carga dinámico */}
      <div className="relative z-10 mt-12 text-center">
        <p className="text-xl text-white/90 font-medium transition-all duration-500 ease-in-out">
          {loadingMessages[phase]}
        </p>
      </div>

      {/* Barra de progreso elegante */}
      <div className="relative z-10 mt-8 w-80 max-w-md">
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-[#ab23ee] to-[#b7011e] rounded-full transition-all duration-300 ease-out shadow-lg"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="text-center mt-3">
          <span className="text-sm text-white/70 font-medium">
            {Math.round(Math.min(progress, 100))}%
          </span>
        </div>
      </div>

      {/* Líneas decorativas suaves */}
      <div className="absolute bottom-20 left-0 w-full">
        <div className="flex justify-center space-x-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-8 bg-gradient-to-t from-[#ab23ee] to-[#b7011e] rounded-full opacity-60 animate-pulse"
              style={{ 
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 