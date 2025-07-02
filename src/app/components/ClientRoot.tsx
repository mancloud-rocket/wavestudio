"use client";
import { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);
  if (loading) return <LoadingScreen onFinish={() => setLoading(false)} />;
  return <>{children}</>;
} 