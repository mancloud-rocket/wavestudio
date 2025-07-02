"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const modules = [
  { name: "WaveBuilder", path: "/wavebuilder", icon: "🧠" },
  { name: "WaveLive", path: "/wavelive", icon: "💬" },
  { name: "WavePrompt", path: "/waveprompt", icon: "🧩" },
  { name: "WaveBridge", path: "/wavebridge", icon: "🔌" },
  { name: "WaveInsights", path: "/waveinsights", icon: "📈" },
  { name: "WaveDeploy", path: "/wavedeploy", icon: "🌐" },
];

const favorites = [
  { name: "Dashboard", path: "/", icon: "🏠" },
  { name: "Live Monitor", path: "/wavelive", icon: "👁️" },
];

const tools = [
  { name: "Ajustes", icon: "⚙️" },
  { name: "Ayuda", icon: "❓" },
  { name: "Feedback", icon: "💬" },
];

const moduleSubtitles: Record<string, string> = {
  WaveBuilder: "Crea y configura agentes IA",
  WaveLive: "Chats en tiempo real",
  WavePrompt: "Gestión de prompts",
  WaveBridge: "Interconecta agentes",
  WaveInsights: "Analítica avanzada",
  WaveDeploy: "Despliega y personaliza",
};

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-20 sm:w-64 h-[calc(100vh-5rem)] mt-4 bg-white/10 backdrop-blur-md border-r border-white/10 flex flex-col items-center py-8 gap-4 shadow-md z-10 rounded-tr-2xl rounded-br-2xl transition-all duration-300 select-none">
      {/* Favoritos */}
      <div className="w-full px-4 mb-2">
        <div className="text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Favoritos</div>
        <nav className="flex flex-col gap-1">
          {favorites.map((fav) => (
            <Link key={fav.name} href={fav.path} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${pathname === fav.path ? "bg-white/20 text-cyan-300 border border-cyan-400/30" : "text-white/70 hover:bg-white/10 hover:text-cyan-200"}`}>
              <span className="text-lg">{fav.icon}</span>
              <span className="hidden sm:inline">{fav.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      {/* Módulos */}
      <div className="w-full px-4 mt-2">
        <div className="text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Módulos</div>
        <nav className="flex flex-col gap-3">
          {modules.map((mod) => {
            const active = pathname.startsWith(mod.path);
            let logo = null;
            if (mod.name === "WaveBuilder") logo = "/builder_v2.png";
            if (mod.name === "WaveDeploy") logo = "/deploy_v2.png";
            if (mod.name === "WaveInsights") logo = "/insight_v2.png";
            if (mod.name === "WaveLive") logo = "/live_v2.png";
            if (mod.name === "WavePrompt") logo = "/prompt_v2.png";
            if (mod.name === "WaveBridge") logo = "/bridge_v2.png";
            return (
              <div className="relative group w-full">
                <Link key={mod.name} href={mod.path} className={`flex items-center justify-center px-0 py-0 rounded-lg font-medium text-xs transition-colors duration-200 h-12 ${active ? "bg-gradient-to-r from-[#ab23ee] to-[#b7011e] text-white border border-[#ab23ee]/60 shadow-lg" : "text-white/70 hover:bg-gradient-to-r hover:from-[#ab23ee] hover:to-[#b7011e] hover:text-white/90"}`} style={{height:'48px'}}>
                  {logo ? (
                    <img src={logo} alt={mod.name + ' Logo'} className="h-8 object-contain" />
                  ) : (
                    <>
                      <span className="text-lg">{mod.icon}</span>
                      <span className="hidden sm:inline">{mod.name}</span>
                    </>
                  )}
                </Link>
                {/* Tooltip subtítulo */}
                {logo && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-[#ab23ee] text-xs font-semibold shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap border border-[#ab23ee]/60">
                    {moduleSubtitles[mod.name]}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      {/* Herramientas */}
      <div className="w-full px-4 mt-4">
        <div className="text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Herramientas</div>
        <div className="flex flex-col gap-1">
          {tools.map((tool) => (
            <button key={tool.name} className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm text-white/60 hover:bg-white/10 hover:text-cyan-200 transition-colors">
              <span className="text-lg">{tool.icon}</span>
              <span className="hidden sm:inline">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Progreso IA */}
      <div className="w-full px-4 mt-6">
        <div className="text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Progreso IA</div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 rounded-full" style={{ width: "68%" }}></div>
        </div>
        <div className="text-xs text-cyan-200 mt-1">Nivel 3/5</div>
      </div>
      {/* Footer */}
      <div className="mt-auto w-full px-4 pb-2 pt-8 text-xs text-white/30 flex flex-col items-center gap-1 border-t border-white/10">
        <span>v1.0.0</span>
        <span>Powered by <span className="text-cyan-300 font-bold">Rocketbot</span></span>
      </div>
    </aside>
  );
} 