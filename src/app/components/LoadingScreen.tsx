"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onFinish();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <Image src="/wavestudio-logo.svg" alt="WaveStudio Logo" width={120} height={120} className="animate-pulse" />
      <span className="text-3xl font-bold tracking-widest text-white mt-6">WaveStudio</span>
      <span className="text-sm text-gray-400 tracking-widest">by Rocketbot</span>
    </div>
  );
} 