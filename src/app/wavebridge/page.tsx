"use client";
import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { supabase } from '../../lib/supabase';

interface Node {
  id: number;
  agente: string;
  x: number;
  y: number;
}
type Connection = [number, number];

export default function WaveBridge() {
  const [showModal, setShowModal] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggedNode, setDraggedNode] = useState<number | null>(null);
  const [offset, setOffset] = useState<{x: number, y: number}>({x:0, y:0});
  const [connecting, setConnecting] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<'privado' | 'publico'>('privado');
  const [agentes, setAgentes] = useState<string[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Obtener agentes existentes de Supabase
  useEffect(() => {
    supabase.from("logs_agente_v2").select("agente_nombre").then(({ data }) => {
      const names = Array.from(new Set((data as any[] || []).map((d:any) => d.agente_nombre).filter(Boolean)));
      setAgentes(names);
    });
  }, []);

  // Drag & drop handlers
  const handleMouseDown = (idx: number, e: MouseEvent<HTMLDivElement>) => {
    setDraggedNode(idx);
    setOffset({
      x: e.clientX - nodes[idx].x,
      y: e.clientY - nodes[idx].y,
    });
  };
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (draggedNode !== null) {
      const newNodes = nodes.slice();
      newNodes[draggedNode] = {
        ...newNodes[draggedNode],
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      };
      setNodes(newNodes);
    }
  };
  const handleMouseUp = () => setDraggedNode(null);

  // Agregar nodo de agente
  const addNode = (agente: string) => {
    setNodes([
      ...nodes,
      {
        id: Date.now() + Math.floor(Math.random()*1000),
        agente,
        x: 100 + nodes.length * 60,
        y: 120 + nodes.length * 40,
      },
    ]);
  };

  // Conexión entre nodos
  const startConnect = (idx: number) => setConnecting(idx);
  const finishConnect = (idx: number) => {
    if (connecting !== null && connecting !== idx) {
      setConnections([...connections, [connecting, idx]]);
    }
    setConnecting(null);
  };

  // Canvas size
  const CANVAS_W = 700, CANVAS_H = 400;

  // Mock integraciones activas (puedes reemplazar por datos reales si lo deseas)
  const mockIntegrations = [
    {
      id: 1,
      name: 'Agente Soporte → Agente Ventas',
      description: 'El output del agente de soporte se pasa al agente de ventas.',
      status: 'Activo',
      agents: ['Agente Soporte', 'Agente Ventas'],
    },
  ];

  return (
    <section className="flex flex-col items-center min-h-screen w-full bg-[#232327] py-12 px-4">
      <div className="w-full max-w-5xl">
        <header className="mb-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow">🔌 WaveBridge</h1>
          <p className="text-lg text-gray-300 max-w-2xl text-center">
            Interconecta agentes existentes, definiendo el flujo de información entre ellos.
          </p>
        </header>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Interconexiones activas</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl shadow-lg font-semibold hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            + Nueva interconexión
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col gap-2 hover:shadow-2xl transition-shadow relative overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-white">{integration.name}</span>
                <span className="ml-auto text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 font-semibold">
                  {integration.status}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-2">{integration.description}</p>
              <div className="flex gap-2 mt-auto">
                {integration.agents.map((agent, idx) => (
                  <span
                    key={idx}
                    className="bg-white/10 text-white text-xs px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm"
                  >
                    {agent}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal para crear nueva interconexión */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
          <div className="bg-[#232327] border border-white/10 rounded-2xl p-0 shadow-2xl w-full max-w-4xl relative animate-fade-in flex flex-col overflow-hidden">
            {/* Header modal */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-white/5">
              <h3 className="text-2xl font-bold text-white">Interconectar agentes</h3>
              <button
                className="text-gray-400 hover:text-white text-2xl"
                onClick={() => setShowModal(false)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            {/* Panel superior: visibilidad */}
            <div className="flex items-center gap-6 px-8 py-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">Visibilidad:</span>
                <select
                  className="bg-white/10 text-white rounded px-2 py-1 border border-white/10 focus:outline-none"
                  value={visibility}
                  onChange={e => setVisibility(e.target.value as 'privado' | 'publico')}
                >
                  <option value="privado">Privado</option>
                  <option value="publico">Público</option>
                </select>
              </div>
              <button className="ml-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-xl shadow font-semibold hover:scale-105 transition-transform text-sm">Simular flujo</button>
            </div>
            {/* Cuerpo: panel lateral y canvas */}
            <div className="flex h-[500px]">
              {/* Panel lateral: lista de agentes */}
              <aside className="w-56 bg-white/5 border-r border-white/10 flex flex-col gap-4 p-4">
                <span className="text-white font-semibold mb-2">Agentes disponibles</span>
                {agentes.length === 0 && <span className="text-gray-400 text-sm">Cargando agentes...</span>}
                {agentes.map(a => (
                  <button
                    key={a}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-xl shadow font-semibold hover:scale-105 transition-transform mb-2"
                    onClick={() => addNode(a)}
                  >
                    + {a}
                  </button>
                ))}
              </aside>
              {/* Canvas visual */}
              <div
                ref={canvasRef}
                className="relative flex-1 bg-white/10 rounded-br-2xl flex items-center justify-center overflow-auto"
                style={{ minWidth: CANVAS_W, minHeight: CANVAS_H }}
              >
                {/* SVG conexiones */}
                <svg className="absolute left-0 top-0 w-full h-full pointer-events-none" width={CANVAS_W} height={CANVAS_H}>
                  {connections.map(([from, to], i) => {
                    const n1 = nodes[from], n2 = nodes[to];
                    if (!n1 || !n2) return null;
                    return (
                      <line
                        key={i}
                        x1={n1.x+60}
                        y1={n1.y+30}
                        x2={n2.x}
                        y2={n2.y+30}
                        stroke="#7dd3fc"
                        strokeWidth="3"
                        markerEnd="url(#arrow)"
                        opacity="0.8"
                      />
                    );
                  })}
                  <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="strokeWidth">
                      <path d="M0,0 L10,5 L0,10" fill="#7dd3fc" />
                    </marker>
                  </defs>
                </svg>
                {/* Nodos */}
                {nodes.map((node, idx) => (
                  <div
                    key={node.id}
                    className={`absolute cursor-move select-none shadow-xl transition-transform duration-150 active:scale-95 z-10`}
                    style={{ left: node.x, top: node.y, width: 140, height: 60 }}
                    onMouseDown={e => handleMouseDown(idx, e)}
                    onDoubleClick={() => startConnect(idx)}
                    onMouseUp={() => finishConnect(idx)}
                  >
                    <div className={`w-full h-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg border-2 border-white/20 relative`}>
                      {node.agente}
                      {connecting === idx && (
                        <span className="absolute -top-3 -right-3 bg-blue-500 text-xs px-2 py-1 rounded-full animate-pulse">Conectando…</span>
                      )}
                    </div>
                  </div>
                ))}
                {/* Ayuda visual */}
                {nodes.length === 0 && (
                  <span className="text-gray-400 text-lg">Agrega agentes desde la izquierda y conéctalos.</span>
                )}
              </div>
            </div>
            {/* Footer modal */}
            <div className="flex justify-end gap-2 px-8 py-4 border-t border-white/10 bg-white/5">
              <button
                className="bg-gray-700 text-white px-5 py-2 rounded-xl shadow font-semibold hover:scale-105 transition-transform"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-xl shadow font-semibold hover:scale-105 transition-transform"
                onClick={() => setShowModal(false)}
              >
                Guardar interconexión
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 