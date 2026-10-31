import React, { useEffect, useState } from 'react';
import { LOGO_IMAGE_PATH } from '../data/scoutData';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimeout = setTimeout(() => {
      setIsFading(true);
    }, 2500);

    const finishTimeout = setTimeout(() => {
      onFinish();
    }, 2850);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(finishTimeout);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#e51c24] select-none transition-opacity duration-300 font-sans ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* CSS Keyframes untuk Efek Mengkilap Miring Satu Kali */}
      <style>{`
        @keyframes shineSweep {
          0% {
            transform: translateX(-160%) skewX(-25deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateX(280%) skewX(-25deg);
            opacity: 0;
          }
        }
        .shimmer-effect-once {
          animation: shineSweep 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.4s 1 forwards;
        }
      `}</style>

      <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
        
        {/* LOGO AMBALAN DENGAN EFEK MENGKILAP MIRING SATU KALI */}
        <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center overflow-hidden rounded-3xl p-2">
          <img
            src={LOGO_IMAGE_PATH}
            alt="Logo Ambalan La Surullah Petta Lopo"
            className="w-full h-full object-contain drop-shadow-2xl relative z-10"
          />

          {/* Sinar Kilap Miring pada Logo */}
          <div 
            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none shimmer-effect-once z-20"
          />
        </div>

        {/* TULISAN: Ambalan La Surullah Petta Lopo */}
        <h1 className="mt-6 text-xl sm:text-2xl font-black text-white tracking-wide leading-tight">
          Ambalan La Surullah Petta Lopo
        </h1>

        {/* TULISAN: Gugus depan 10.035-10.036 (MENGKILAP SEIRAMA DENGAN LOGO) */}
        <div className="relative overflow-hidden inline-block mt-2 px-4 py-1 rounded-full bg-black/15 border border-white/25">
          <span className="text-xs sm:text-sm font-extrabold text-white tracking-widest uppercase block relative z-10 font-mono">
            Gugus depan 10.035-10.036
          </span>

          {/* Sinar Kilap Miring pada Tulisan Gugus Depan (Seirama dengan Logo) */}
          <div 
            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none shimmer-effect-once z-20"
          />
        </div>

      </div>
    </div>
  );
};
