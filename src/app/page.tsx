"use client";

import { useState, useRef, useEffect } from "react";
import Chat from "../components/Chat";

export default function Home() {
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Configurar volume máximo desde o início
      video.volume = 1.0;
      
      // Ativar som no primeiro click (navegadores bloqueiam autoplay com som)
      const enableSound = () => {
        video.muted = false;
        video.volume = 1.0;
      };
      document.addEventListener('click', enableSound, { once: true });
    }
  }, []);

  const handleVideoEnd = () => {
    console.log("🏁 Vídeo terminou de reproduzir");
    setIsVideoEnded(true);
  };

  const handleVideoClick = () => {
    console.log("👆 Vídeo clicado");
    if (videoRef.current && videoRef.current.paused) {
      console.log("▶️ Reproduzindo vídeo pausado...");
      videoRef.current.play();
    }
  };

  const handleStartChat = () => {
    setIsChatOpen(true);
  };

  if (isChatOpen) {
    return <Chat />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-red-950 to-blue-900 p-4">
      <main className="flex flex-col items-center justify-center gap-6 md:gap-12 px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 w-full max-w-6xl">
        
        {/* Video e Botão juntos em mobile/tablet, separados em desktop */}
        <div className="flex flex-col md:flex-col items-center gap-6 md:gap-8 w-full">
          
          {/* Container Video + Botão (lado a lado) */}
          <div className="flex flex-row items-center justify-center gap-4 md:gap-6">
            {/* Video Container */}
            <div className={`relative group flex-shrink-0 transition-all duration-700 ${
              isVideoEnded ? 'scale-75' : 'scale-100'
            }`}>
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-800 to-red-800 animate-pulse opacity-75 blur-xl"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-800 to-blue-800 animate-spin-slow opacity-50"></div>
              
              {/* Video Circle */}
              <div 
                className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 sm:border-6 md:border-8 border-white dark:border-gray-800 shadow-2xl transform transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                onClick={handleVideoClick}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  loop={false}
                  onEnded={handleVideoEnd}
                  className="w-full h-full object-cover scale-100"
                >
                  <source src="/vedeo-ally.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Botão ao lado do vídeo - estilo balão de conversa (todos os dispositivos) */}
            {isVideoEnded && (
              <div className="flex items-center relative animate-fadeIn">
                <button
                  onClick={handleStartChat}
                  className="
                    relative px-5 py-3 md:px-6 md:py-4
                    rounded-3xl text-sm md:text-base lg:text-lg font-medium
                    transition-all duration-500 transform
                    before:content-[''] before:absolute before:left-[-8px] before:md:left-[-10px] before:top-1/2 before:-translate-y-1/2
                    before:w-0 before:h-0 
                    before:border-t-[10px] before:md:border-t-[12px] before:border-t-transparent
                    before:border-r-[12px] before:md:border-r-[16px] before:border-r-blue-800
                    before:border-b-[10px] before:md:border-b-[12px] before:border-b-transparent
                    bg-gradient-to-r from-blue-800 to-red-800 text-white shadow-2xl hover:shadow-3xl hover:scale-105 cursor-pointer animate-pulse
                  "
                >
                  <div className="flex flex-col items-start gap-0.5 md:gap-1">
                    <span className="text-xs md:text-sm opacity-80">💬</span>
                    <span>Começar Chat</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Descrições abaixo */}
          <div className="text-center w-full max-w-2xl px-4">
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 animate-fadeIn">
              Bem-vindo ao Ally
            </h1>
            <div className="text-sm sm:text-base md:text-lg text-gray-200 mb-4 md:mb-8 animate-fadeIn space-y-2">
              <p className="font-medium">Seu assistente virtual inteligente 🤖</p>
              <p className="text-xs sm:text-sm md:text-base text-gray-300">
                Converse, tire dúvidas e receba ajuda personalizada a qualquer momento. 
                Estou aqui para tornar sua experiência mais fácil e eficiente.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
