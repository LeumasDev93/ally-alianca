"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatProps {
  onClose?: () => void;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
}

export default function Chat({ onClose }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Olá! Como posso ajudá-lo hoje?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [showImage, setShowImage] = useState(true);
  const [activeMenu, setActiveMenu] = useState<'messages' | 'home'>('home');
  const [showAllConversations, setShowAllConversations] = useState(false);
  
  // Histórico de conversas
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Ajuda com produto',
      lastMessage: 'Obrigado pela ajuda!',
      timestamp: 'Há 2 horas',
    },
    {
      id: '2',
      title: 'Dúvida sobre pagamento',
      lastMessage: 'Qual a forma de pagamento disponível?',
      timestamp: 'Ontem',
      unread: 2,
    },
    {
      id: '3',
      title: 'Suporte técnico',
      lastMessage: 'O problema foi resolvido',
      timestamp: '2 dias atrás',
    },
    {
      id: '4',
      title: 'Informações gerais',
      lastMessage: 'Como posso ajudar?',
      timestamp: '3 dias atrás',
    },
  ]);

  const handleNewConversation = () => {
    setActiveMenu('messages');
    setMessages([{ text: "Olá! Como posso ajudá-lo hoje?", isUser: false }]);
  };

  useEffect(() => {
    // Alternar entre imagem e título a cada 3 segundos
    const interval = setInterval(() => {
      setShowImage(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      setInputMessage("");
      
      // Simulação de resposta do bot
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "Obrigado pela sua mensagem! Como posso ajudar?", 
          isUser: false 
        }]);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-red-950 to-blue-900 md:p-4">
      <div className={`w-full h-full md:max-w-4xl md:max-h-[90vh] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn ${
        activeMenu === 'home' ? 'bg-gradient-to-br from-blue-900 via-red-900 to-blue-900' : 'bg-white dark:bg-gray-800'
      }`}>
        {/* Chat Header */}
        {activeMenu === 'messages' ? (
          // Header para Messages
          <div className="bg-gradient-to-r from-blue-900 to-red-900 p-4 sm:p-5 md:p-6 text-white">
            <div className="flex items-center justify-between gap-4">
              {/* Alterna entre imagens múltiplas em círculo e título */}
              <div className="relative flex items-center gap-4 min-h-[64px]">
                {/* Múltiplas imagens do Ally em círculo - Equipe disponível */}
                <div className={`transition-all duration-700 ease-in-out ${showImage ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'}`}>
                  <div className="flex items-center -space-x-3">
                    {/* Imagem 1 */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white shadow-lg flex-shrink-0 relative z-30">
                      <Image
                        src="/ally.png"
                        alt="Ally 1"
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/30 border-2 border-white shadow-lg flex-shrink-0 flex items-center justify-center relative z-0">
                      <span className="text-xs sm:text-sm font-bold">B</span>
                    </div>
                    {/* Imagem 2 */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white shadow-lg flex-shrink-0 relative z-20 opacity-90">
                      <Image
                        src="/ally.png"
                        alt="Ally 2"
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Imagem 3 */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/30 border-2 border-white shadow-lg flex-shrink-0 flex items-center justify-center relative z-0">
                      <span className="text-xs sm:text-sm font-bold">R</span>
                    </div>
                    {/* Contador adicional */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/30 border-2 border-white shadow-lg flex-shrink-0 flex items-center justify-center relative z-0">
                      <span className="text-xs sm:text-sm font-bold">+5</span>
                    </div>
                  </div>
                </div>
                
                {/* Título completo */}
                <div className={`transition-all duration-700 ease-in-out ${!showImage ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute'}`}>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold whitespace-nowrap">Ally Bot</h2>
                </div>
              </div>
              
              {/* Informação da equipe */}
              <div className="flex-1 text-right">
                <p className="text-xs sm:text-sm font-semibold">
                  {showImage ? '8 assistentes online' : 'Estamos aqui para ajudar'}
                </p>
                <p className="text-xs opacity-75 hidden sm:block">
                  {showImage ? 'Tempo médio de resposta: < 1 min' : 'Sempre disponível'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Header para Home - Top bar apenas
          <div className="flex flex-col">
            {/* Top bar com logo e ícones */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5">
                  <div className="h-0.5 w-3 bg-white"></div>
                  <div className="h-0.5 w-4 bg-white"></div>
                  <div className="h-0.5 w-5 bg-white"></div>
                </div>
                <span className="text-white font-bold text-lg">ALLY</span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Círculos de perfil */}
                <div className="flex items-center -space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                    <Image
                      src="/ally.png"
                      alt="Assistente 1"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">K</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">E</span>
                  </div>
                </div>
                
                <button onClick={onClose} className="text-white text-2xl font-light">×</button>
              </div>
            </div>
          </div>
        )}
        
        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto ${activeMenu === 'messages' ? 'bg-white dark:bg-gray-800' : ''}`}>
          {activeMenu === 'home' ? (
            // Home - Todo em gradiente
            <div className="flex flex-col h-full">
              {/* Saudação */}
              <div className="px-6 pb-6 pt-8">
                <h1 className="text-white text-4xl sm:text-5xl font-bold mb-2">
                  Olá 👋
                </h1>
                <p className="text-white text-2xl sm:text-3xl font-medium mb-6">
                  Como podemos ajudar?
                </p>
              </div>
              
              {/* Histórico - mostra apenas 1 */}
              <div className="px-6 pb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white/90 mb-3">
                  Conversas Recentes
                </h3>
                
                {/* Primeira conversa apenas */}
                {conversations.slice(0, showAllConversations ? conversations.length : 1).map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setActiveMenu('messages')}
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group mb-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                            {conversation.title}
                          </h4>
                          {conversation.unread && (
                            <span className="bg-white text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/70 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      <span className="text-xs text-white/60 whitespace-nowrap flex-shrink-0">
                        {conversation.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Botão Ver Mais */}
                {!showAllConversations && conversations.length > 1 && (
                  <button
                    onClick={() => setShowAllConversations(true)}
                    className="w-full text-white/80 hover:text-white py-2 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    Ver mais ({conversations.length - 1})
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
                
                {/* Mostrar todas as conversas quando expandido */}
                {showAllConversations && conversations.slice(1).map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setActiveMenu('messages')}
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group mb-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                            {conversation.title}
                          </h4>
                          {conversation.unread && (
                            <span className="bg-white text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/70 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      <span className="text-xs text-white/60 whitespace-nowrap flex-shrink-0">
                        {conversation.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Campo "Envie-nos uma mensagem" - ABAIXO do histórico */}
              <div className="px-6 pb-6 mt-auto">
                <button
                  onClick={handleNewConversation}
                  className="w-full bg-white text-gray-700 px-6 py-4 rounded-xl font-medium text-base sm:text-lg flex items-center justify-between hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <span>Envie-nos uma mensagem</span>
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            // Messages - Chat
            <div className="space-y-3 sm:space-y-4 p-4 sm:p-5 md:p-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-slideIn`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-800 to-red-800 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Input Area - Only show in Messages */}
        {activeMenu === 'messages' && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-white dark:bg-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-900 to-red-900 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Enviar
              </button>
            </div>
          </div>
        )}

        {/* Footer Menu */}
        <div className={`border-t ${activeMenu === 'home' ? 'border-white/20' : 'border-gray-200 dark:border-gray-700'} ${activeMenu === 'messages' ? 'bg-white dark:bg-gray-800' : ''}`}>
          <div className="flex items-center justify-around p-2 sm:p-3">
            {/* Home Menu */}
            <button
              onClick={() => {
                setActiveMenu('home');
                setShowAllConversations(false);
              }}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all duration-300 ${
                activeMenu === 'home'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${activeMenu === 'home' && 'text-white'}`}
            >
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Home</span>
            </button>

            {/* Messages Menu */}
            <button
              onClick={() => setActiveMenu('messages')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all duration-300 ${
                activeMenu === 'messages'
                  ? 'bg-gradient-to-r from-blue-800 to-red-800 text-white shadow-lg'
                  : activeMenu === 'home'
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Mensagens</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

