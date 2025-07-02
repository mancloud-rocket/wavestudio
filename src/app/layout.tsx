import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import ClientRoot from "./components/ClientRoot";
import Sidebar from "./components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "WaveStudio | Rocketbot",
  description: "Suite para gestión de agentes digitales de IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${orbitron.variable} antialiased bg-gradient-to-br from-[#18151e] via-[#23202b] to-[#18151e] min-h-screen flex flex-col relative overflow-x-hidden font-sans`}>
        <ClientRoot>
          {/* Header Bar */}
          <header className="fixed top-0 left-0 w-full h-20 z-30 flex items-center justify-between px-8 bg-white/5 backdrop-blur-md shadow-md border-b border-[#ab23ee]/30">
            <div className="flex items-center gap-6">
              <Image src="/logo_v2.png" alt="WaveStudio Logo" width={300} height={120} className="object-contain" />
              {/* Search bar */}
              <div className="ml-8 flex items-center bg-white/10 border border-white/10 rounded-xl px-4 py-2 w-64 max-w-xs focus-within:ring-2 ring-[#ab23ee] transition-all">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white/40 mr-2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input className="bg-transparent outline-none border-none text-white/80 placeholder:text-white/40 w-full font-inter" placeholder="Buscar en WaveStudio..." />
              </div>
            </div>
            <div className="flex items-center gap-6">
              {/* AI Status */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#ab23ee]/20 border border-[#ab23ee]/30 text-[#ab23ee] font-medium text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                AI: Online
              </div>
              {/* Notificaciones */}
              <button className="relative p-2 rounded-full bg-white/10 border border-white/10 text-white/70 hover:bg-white/20 transition-colors">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 16v-5a6 6 0 10-12 0v5a2 2 0 002 2h8a2 2 0 002-2z" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#ab23ee] rounded-full animate-pulse"></span>
              </button>
              {/* Quick Actions */}
              <div className="relative group">
                <button className="p-2 rounded-full bg-[#ab23ee]/20 border border-[#ab23ee]/30 text-[#ab23ee] hover:bg-[#b7011e]/30 transition-colors font-bold">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l2 2" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-44 bg-[#23202b] border border-[#ab23ee]/10 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                  <div className="p-4 text-[#ab23ee] text-sm font-semibold">Próximamente: Quick Actions</div>
                </div>
              </div>
              {/* Usuario mejorado */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-white/10 border border-white/10 text-white/80 font-medium text-base hover:bg-white/20 transition-colors min-w-[180px]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ab23ee] to-[#b7011e] flex items-center justify-center overflow-hidden">
                  <span className="text-lg text-white font-bold select-none">JD</span>
                </div>
                <div className="flex flex-col items-start justify-center">
                  <span className="font-semibold text-white leading-tight">Juan Doe</span>
                  <span className="text-xs text-[#ab23ee] bg-[#ab23ee]/10 px-2 py-0.5 rounded-full font-bold mt-0.5">Admin</span>
                </div>
              </div>
            </div>
          </header>
          {/* Layout principal con sidebar y contenido */}
          <div className="flex flex-1 pt-20 min-h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col min-h-screen w-full bg-gradient-to-br from-[#23202b] via-[#232526] to-[#18151e] p-8 overflow-y-auto gap-8 transition-colors duration-300">
        {children}
            </main>
          </div>
        </ClientRoot>
      </body>
    </html>
  );
}
