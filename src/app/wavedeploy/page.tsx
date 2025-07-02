"use client";
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const mockDeployments = [
  {
    id: 1,
    agent: 'Agente Soporte',
    channels: [
      { name: 'Web', status: 'Activo' },
      { name: 'WhatsApp', status: 'En espera' },
    ],
    branding: { logo: '/logo_v2.png', color: '#ab23ee' },
    lastDeployed: '2024-06-01',
  },
  {
    id: 2,
    agent: 'Agente Ventas',
    channels: [
      { name: 'Slack', status: 'Activo' },
      { name: 'API', status: 'Error' },
    ],
    branding: { logo: '/logo.png', color: '#b7011e' },
    lastDeployed: '2024-05-28',
  },
];

export default function WaveDeploy() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="flex flex-col items-center min-h-screen w-full bg-[#232327] py-12 px-4">
      <div className="w-full max-w-5xl">
        <header className="mb-10 flex flex-col items-center">
          <img src="/deploy_v2.png" alt="WaveDeploy Logo" className="w-[350px] h-[75px] mb-2 drop-shadow-lg" style={{objectFit:'contain'}} />
          <p className="text-lg text-gray-300 max-w-2xl text-center">
            Configura y gestiona todos tus canales de despliegue, branding y enrutamiento de agentes.
          </p>
        </header>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Despliegues activos</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl shadow-lg font-semibold hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            + Desplegar agente
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockDeployments.map((deploy) => (
            <div
              key={deploy.id}
              className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col gap-2 hover:shadow-2xl transition-shadow relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-2">
                <img src={deploy.branding.logo} alt="logo" className="w-10 h-10 rounded-full border-2 border-white/20 bg-white/10" />
                <span className="text-lg font-bold text-white">{deploy.agent}</span>
                <span className="ml-auto text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-semibold">
                  Último: {deploy.lastDeployed}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap mb-2">
                {deploy.channels.map((ch, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${
                      ch.status === 'Activo'
                        ? 'bg-green-500/20 text-green-300 border-green-400/20'
                        : ch.status === 'En espera'
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/20'
                        : 'bg-red-500/20 text-red-300 border-red-400/20'
                    }`}
                  >
                    {ch.name} - {ch.status}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-auto">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-xl shadow font-semibold hover:scale-105 transition-transform text-xs">Ver detalles</button>
                <button className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-4 py-1 rounded-xl shadow font-semibold hover:scale-105 transition-transform text-xs">Rollback</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal para desplegar agente */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#232327] border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-lg relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-white mb-4">Desplegar agente</h3>
            <p className="text-gray-300 mb-4">Próximamente: wizard para seleccionar agente, canal, branding y reglas de despliegue.</p>
            <div className="flex justify-end">
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-xl shadow font-semibold hover:scale-105 transition-transform"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 